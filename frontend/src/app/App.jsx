import { useEffect, useState } from "react";
import { AUTH_SCREENS, APP_NAME } from "@shared/constants/auth.constants.js";
import { refreshAccessToken } from "@shared/api/axios.js";

import { LoginPage } from "@pages/LoginPage.jsx";
import { RegisterPage } from "@pages/RegisterPage.jsx";
import { ForgotPasswordPage } from "@pages/ForgotPasswordPage.jsx";
import { VerifyOtpPage } from "@pages/VerifyOtpPage.jsx";
import { ResetPasswordPage } from "@pages/ResetPasswordPage.jsx";
import { AppLayout } from "@widgets/layouts";
import { APP_MENU, ALL_PAGES, DEFAULT_PAGE_ID } from "@app/appPages.js";
import { useProfileStore } from "@features/profile/model/useProfileStore.js";
import { useWorldStore } from "@features/world/model/useWorldStore.js";
import { useWorkStore } from "@features/work/model/useWorkStore.js";
import { useMissionStore } from "@features/missions/model/useMissionStore.js";

import "@app/styles/index.css";

export default function App() {
  // accessToken живёt только в памяти (AuthSession) и не переживает
  // перезагрузку страницы — поэтому при монтировании делаем "тихий"
  // refresh: если у браузера есть валидная httpOnly refreshToken-cookie,
  // сессия восстановится сама, без повторного логина.
  const [booting, setBooting] = useState(true);
  const [screen, setScreen] = useState(AUTH_SCREENS.LOGIN);
  const [screenParams, setScreenParams] = useState({});
  const [appPage, setAppPage] = useState(DEFAULT_PAGE_ID);
  const [pageParams, setPageParams] = useState({});

  useEffect(() => {
    let cancelled = false;

    refreshAccessToken()
      .then(() => {
        if (!cancelled) setScreen(AUTH_SCREENS.APP);
      })
      .catch(() => {
        // Нет валидной cookie-сессии — остаёмся на экране логина.
      })
      .finally(() => {
        if (!cancelled) setBooting(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const navigate = (newScreen, params = {}) => {
    setScreen(newScreen);
    setScreenParams(params);
  };

  const handleLoginSuccess = () => {
    navigate(AUTH_SCREENS.APP);
  };

  // Переход между страницами приложения; params — данные для страницы
  // (например, { cityId } для «Миссий»).
  const navigateApp = (pageId, params = {}) => {
    // Итог миссии показывается один раз: уходя со страницы итога, сбрасываем его.
    if (appPage === "mission-result" && pageId !== "mission-result") {
      useMissionStore.getState().clearResult();
    }
    setAppPage(pageId);
    setPageParams(params);
  };

  const handleLogout = () => {
    useProfileStore.getState().clear();
    useWorldStore.getState().clear();
    useWorkStore.getState().clear();
    useMissionStore.getState().clear();
    navigateApp(DEFAULT_PAGE_ID);
    navigate(AUTH_SCREENS.LOGIN);
  };

  if (booting) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <span className="text-muted">{APP_NAME}…</span>
      </div>
    );
  }

  switch (screen) {
    case AUTH_SCREENS.REGISTER:
      return <RegisterPage onNavigate={navigate} />;

    case AUTH_SCREENS.FORGOT:
      return <ForgotPasswordPage onNavigate={navigate} />;

    case AUTH_SCREENS.OTP:
      return (
        <VerifyOtpPage onNavigate={navigate} email={screenParams.email ?? ""} />
      );

    case AUTH_SCREENS.RESET:
      return (
        <ResetPasswordPage
          onNavigate={navigate}
          verifiedToken={screenParams.verifiedToken}
        />
      );

    case AUTH_SCREENS.APP: {
      const current =
        ALL_PAGES.find((page) => page.id === appPage) ?? ALL_PAGES[0];
      const CurrentPage = current.Page;
      return (
        <AppLayout
          items={APP_MENU}
          activeId={current.menuId ?? current.id}
          onSelect={navigateApp}
          onLogout={handleLogout}
        >
          <CurrentPage navigate={navigateApp} params={pageParams} />
        </AppLayout>
      );
    }

    default:
      return (
        <LoginPage
          onNavigate={navigate}
          onLoginSuccess={handleLoginSuccess}
          notice={screenParams.notice}
        />
      );
  }
}
