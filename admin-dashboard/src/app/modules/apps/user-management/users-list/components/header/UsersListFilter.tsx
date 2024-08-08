import { useEffect, useState } from "react";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import {
  initialQueryState,
  KTIcon,
} from "../../../../../../../_metronic/helpers";
import { useQueryRequest } from "../../core/QueryRequestProvider";
import {
  useChatStatus,
  useQueryResponse,
  useQueryResponseData,
  useSubscriptionStatus,
} from "../../core/QueryResponseProvider";

const UsersListFilter = () => {
  const { updateState } = useQueryRequest();
  const { isLoading } = useQueryResponse();
  const [role, setRole] = useState<string | undefined>();
  const [lastLogin, setLastLogin] = useState<string | undefined>();
  const { subscriptionStatus, setSubscriptionStatus } = useSubscriptionStatus();
  const { chatStatus, setChatStatus } = useChatStatus();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const resetData = () => {
    updateState({ filter: undefined, ...initialQueryState });
  };

  const filterData = () => {
    setChatStatus("");
    setSubscriptionStatus("");
  };

  return (
    <>
      {/* begin::Filter Button */}
      <button
        disabled={isLoading}
        type="button"
        className="btn btn-light-primary me-3"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <KTIcon iconName="filter" className="fs-2" />
        Filter
      </button>
      {/* end::Filter Button */}
      {/* begin::SubMenu */}
      <div
        className="menu menu-sub menu-sub-dropdown w-300px w-md-325px"
        data-kt-menu="true"
      >
        {/* begin::Header */}
        <div className="px-7 py-5">
          <div className="fs-5 text-gray-900 fw-bolder">Filter Options</div>
        </div>
        {/* end::Header */}

        {/* begin::Separator */}
        <div className="separator border-gray-200"></div>
        {/* end::Separator */}

        {/* begin::Content */}
        <div className="px-7 py-5" data-kt-user-table-filter="form">
          {/* begin::Input group */}
          <div className="mb-10">
            <label className="form-label fs-6 fw-bold">Chat Status:</label>
            <select
              className="form-select form-select-solid fw-bolder"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-allow-clear="true"
              data-kt-user-table-filter="role"
              data-hide-search="true"
              onChange={(e) => setChatStatus(e.target.value)}
              value={chatStatus}
            >
              <option value=""></option>
              <option value="Not Started">No Started</option>
              <option value="In progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="mb-10">
            <label className="form-label fs-6 fw-bold">
              Subscription Status:
            </label>
            <select
              className="form-select form-select-solid fw-bolder"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-allow-clear="true"
              data-kt-user-table-filter="two-step"
              data-hide-search="true"
              onChange={(e) => setSubscriptionStatus(e.target.value)}
              value={subscriptionStatus}
            >
              <option value=""></option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              disabled={isLoading}
              onClick={filterData}
              className="btn btn-danger fw-bold px-6"
              data-kt-menu-dismiss="true"
              data-kt-user-table-filter="reset"
            >
              Reset
            </button>
          </div>
          {/* end::Actions */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::SubMenu */}
    </>
  );
};

export { UsersListFilter };
