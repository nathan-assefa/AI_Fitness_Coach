import { Fragment } from "react";
import { KTIcon } from "../../../../helpers";
import { Link } from "react-router-dom";

type Props = {
  className: string;
};

const rows: Array<{ description: string; url: string }> = [
  { description: "Statistics", url: "/crafted/widgets/statistics" },
  { description: "User Management", url: "/apps/user-management/users" },
];

const handleButtonClick = (url: string) => {
  window.location.href = url;
};

const ListsWidget26 = ({ className }: Props) => (
  <div className={`card card-flush ${className}`}>
    <div className="card-header pt-5">
      <h3 className="card-title text-gray-800 fw-bold">Dashboard Overview</h3>
      <div className="card-toolbar"></div>
    </div>
    <div className="card-body pt-5">
      {rows.map((row, index) => (
        <Fragment key={`lw26-rows-${index}`}>
          <div className="d-flex flex-stack">
            <Link to={row.url} className="text-primary fw-semibold fs-6 me-2">
              {row.description}
            </Link>
            <button
              type="button"
              className="btn btn-icon btn-sm h-auto btn-color-gray-500 btn-active-color-primary justify-content-end"
              onClick={() => handleButtonClick(row.url)}
            >
              <KTIcon iconName="exit-right-corner" className="fs-2" />
            </button>
          </div>
          {rows.length - 1 > index && (
            <div className="separator separator-dashed my-3" />
          )}
        </Fragment>
      ))}
    </div>
  </div>
);

export { ListsWidget26 };
