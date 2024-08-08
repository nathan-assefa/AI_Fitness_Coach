import clsx from "clsx";
import { KTIcon } from "../../../helpers";
import { ThemeModeSwitcher } from "../../../partials";
import { useLayout } from "../../core";
import { Button } from "react-bootstrap";
import { useAuth } from "../../../../lib/providers/auth-provider";

const itemClass = "ms-1 ms-md-4";
const btnClass =
  "btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px";
const userAvatarClass = "symbol-35px";
const btnIconClass = "fs-2";

const Navbar = () => {
  const { config } = useLayout();
  const { logOutUser: signOut } = useAuth();
  return (
    <div className="app-navbar flex-shrink-0">
      {/* <div className={clsx("app-navbar-item", itemClass)}>
        <div id="kt_activities_toggle" className={btnClass}>
          <KTIcon iconName="chart-simple" className={btnIconClass} />
        </div>
      </div> */}

      {/* <div className={clsx("app-navbar-item", itemClass)}>
        <div
          className={clsx("position-relative", btnClass)}
          id="kt_drawer_chat_toggle"
        >
          <KTIcon iconName="message-text-2" className={btnIconClass} />
          <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink" />
        </div>
      </div> */}

      <div className={clsx("app-navbar-item", itemClass)}>
        <ThemeModeSwitcher
          toggleBtnClass={clsx("btn-active-light-primary btn-custom")}
        />
      </div>
      <Button
        onClick={async () => {
          try {
            await signOut();
          } catch (error) {
            alert("There was a problem signing out");
          }
        }}
        type="button"
        className="btn btn-secondary d-flex align-items-center justify-content-center"
        style={{ height: "60%", marginTop: "1em", marginLeft: "10px" }}
      >
        Logout
      </Button>

      {/* {config.app?.header?.default?.menu?.display && (
        <div
          className="app-navbar-item d-lg-none ms-2 me-n3"
          title="Show header menu"
        >
          <div
            className="btn btn-icon btn-active-color-primary w-35px h-35px"
            id="kt_app_header_menu_toggle"
          >
            <KTIcon iconName="text-align-left" className={btnIconClass} />
          </div>
        </div>
      )} */}
    </div>
  );
};

export { Navbar };
