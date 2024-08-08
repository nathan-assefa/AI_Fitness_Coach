import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import {
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
} from "../../../_metronic/partials/widgets";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { getUsersList } from "../../../lib/utils/user-list";
import { UserListResponse } from "../../../lib/types";
import CardsWidget18 from "../../../_metronic/partials/widgets/_new/cards/CardsWidget18";

const DashboardPage: FC = () => {
  const [userList, setUserList] = useState<UserListResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsersList();
        setUserList(users);
        setIsLoading(false);
      } catch (err) {
        setError("error loading user list");
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* begin::Row */}
        <div className="row g-5 g-xl-10 mb-5 mb-xl-10">
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget20
              className="h-md-50 mb-5 mb-xl-10"
              description="Active Users"
              color="#F1416C"
              img={toAbsoluteUrl("media/patterns/vector-1.png")}
            />
            <CardsWidget7
              className="h-md-50 mb-5 mb-xl-10"
              description="User Unsubscription Total"
              icon={false}
              stats={11}
              labelColor="dark"
              textColor="gray-300"
            />
          </div>

          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            <CardsWidget17 className="h-md-50 mb-5 mb-xl-10" />
            <ListsWidget26 className="h-lg-50" />
          </div>
        </div>

        <div className="row gx-5 gx-xl-10">
          <div className="col-xxl-6 mb-5 mb-xl-10"></div>
          <div className="col-xxl-6 mb-5 mb-xl-10"></div>
        </div>

        <div className="row g-5 gx-xxl-8">
          <div className="col-xxl-4">
            <MixedWidget8
              className="card-xxl-stretch mb-xl-3"
              chartColor="success"
              chartHeight="150px"
            />
          </div>

          <CardsWidget18 />
        </div>
      </Content>
    </>
  );
};

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DASHBOARD" })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
