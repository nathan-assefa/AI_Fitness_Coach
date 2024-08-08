import { FC, useMemo } from "react";
import {
  StatisticsWidget1,
  StatisticsWidget2,
  StatisticsWidget3,
  StatisticsWidget4,
  StatisticsWidget5,
  StatisticsWidget6,
} from "../../../../_metronic/partials/widgets";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useFetchData } from "../../../../redux/components/useFetchUserData";

const Statistics: FC = () => {
  const { userList, analyticsData } = useFetchData();
  console.log(analyticsData);
  const conversion_rate =
    analyticsData?.performance_information.trial_to_paid_conversion_rate.toFixed(
      2
    );
  const plan_name =
    analyticsData?.subscription_information.popular_plan?.plan ?? null;

  let capitalizedPlanName = "";
  if (plan_name) {
    capitalizedPlanName = plan_name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const plance_prefference_percentage = useMemo(() => {
    if (
      !analyticsData ||
      !analyticsData.activity_information ||
      !analyticsData.subscription_information
    ) {
      return 0;
    }

    const totalUsers = analyticsData.activity_information.total_users;
    const popularPlanCount =
      analyticsData.subscription_information.popular_plan?.count ?? 0;

    const percentage = (popularPlanCount / totalUsers) * 100;
    return percentage.toFixed(2);
  }, [analyticsData]);

  const { usersNotStartedChat, usersInProgressChat, usersCompletedChat } =
    useMemo(() => {
      const usersNotStartedChat = userList?.users.filter(
        (user) => user.chat_status === "Not Started"
      ).length;
      const usersInProgressChat = userList?.users.filter(
        (user) => user.chat_status === "In progress"
      ).length;
      const usersCompletedChat = userList?.users.filter(
        (user) => user.chat_status === "Completed"
      ).length;

      return {
        usersNotStartedChat,
        usersInProgressChat,
        usersCompletedChat,
      };
    }, [userList]);

  console.log(analyticsData?.comparative_analysis);

  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* begin::Row */}
        <div className="row g-5 g-xl-8">
          <div className="col-xl-3">
            <StatisticsWidget5
              className="card-xl-stretch mb-xl-8"
              svgIcon="chart-simple"
              color="purple"
              iconColor="primary"
              title={`${
                analyticsData?.revenue_information?.total_revenue
                  ? analyticsData.revenue_information.total_revenue
                  : 0
              }$`}
              description="Total Revenue"
            />
          </div>

          <div className="col-xl-3">
            <StatisticsWidget5
              className="card-xl-stretch mb-xl-8"
              svgIcon="cheque"
              color="dark"
              iconColor="white"
              title={`+${userList?.count ? userList.count : 0}`}
              titleColor="white"
              description="Total number of users"
              descriptionColor="white"
            />
          </div>

          <div className="col-xl-3">
            <StatisticsWidget5
              className="card-xl-stretch mb-xl-8"
              svgIcon="briefcase"
              color="warning"
              iconColor="white"
              title={`${conversion_rate ?? 0}`}
              titleColor="white"
              description="Trial to Paid Conversion Rate"
              descriptionColor="white"
            />
          </div>

          <div className="col-xl-3">
            <StatisticsWidget5
              className="card-xl-stretch mb-5 mb-xl-8"
              svgIcon="chart-pie-simple"
              color="info"
              iconColor="white"
              title={`${plance_prefference_percentage ?? 0}%`}
              titleColor="white"
              description={
                analyticsData?.subscription_information.popular_plan?.count
                  ? `${capitalizedPlanName} is the popular plan, selected by ${analyticsData.subscription_information.popular_plan?.count} of users`
                  : "No Popular plan yet"
              }
              descriptionColor="white"
            />
          </div>
        </div>

        {/* begin::Row */}
        <div className="row g-5 g-xl-8">
          <h3>Plan Comparison</h3>
          <div className="col-xl-4">
            <StatisticsWidget1
              className="card-xl-stretch mb-xl-8"
              image="abstract-4.svg"
              title="Meal Plan"
              time={`$${
                analyticsData?.comparative_analysis.plan_comparison[0]?.total ??
                0
              }`}
              description="Total Revenue for Meal Plan"
            />
          </div>
          <div className="col-xl-4">
            <StatisticsWidget1
              className="card-xl-stretch mb-xl-8"
              image="abstract-4.svg"
              title="Workout Plan"
              time={`$${
                analyticsData?.comparative_analysis.plan_comparison[1]?.total ??
                0
              }`}
              description="Total Revenue for Workout Plan"
            />
          </div>
          <div className="col-xl-4">
            <StatisticsWidget1
              className="card-xl-stretch mb-xl-8"
              image="abstract-4.svg"
              title="Meal and Workout Plan"
              time={`$${
                analyticsData?.comparative_analysis.plan_comparison[2]?.total ??
                0
              }`}
              description="Total Revenue for Meal and Workout Plan"
            />
          </div>
          {/* <div className="col-xl-4">
            <StatisticsWidget2
              className="card-xl-stretch mb-xl-8"
              avatar="/media/svg/avatars/029-boy-11.svg"
              title="Arthur Goldstain"
              description="System & Software Architect"
            />
          </div>

          <div className="col-xl-4">
            <StatisticsWidget1
              className="card-xl-stretch mb-xl-8"
              image="abstract-2.svg"
              title="Meeting Schedule"
              time="03 May 2020"
              description="Great blog posts don’t just happen Even the best bloggers need it"
            />
          </div> */}
        </div>
        {/* end::Row */}

        <div className="row g-5 g-xl-8">
          <div className="col-xl-4">
            <StatisticsWidget5
              className="card-xl-stretch mb-5 mb-xl-8"
              svgIcon="briefcase"
              color="danger"
              iconColor="white"
              title={`${usersNotStartedChat}`}
              titleColor="white"
              description="Users Not Yet Started Chatting"
              descriptionColor="white"
            />
          </div>
          <div className="col-xl-4">
            <StatisticsWidget5
              className="card-xl-stretch mb-xl-8"
              svgIcon="cheque"
              color="primary"
              iconColor="white"
              title={`${usersInProgressChat}`}
              titleColor="white"
              description="Users Currently Chatting"
              descriptionColor="white"
            />
          </div>
          <div className="col-xl-4">
            <StatisticsWidget5
              className="card-xl-stretch mb-xl-8"
              svgIcon="basket"
              color="success"
              iconColor="white"
              title={`${usersCompletedChat}`}
              titleColor="white"
              description="Total Users Completing Chat"
              descriptionColor="white"
            />
          </div>
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        {/* <div className="row g-5 g-xl-8">
          <div className="col-xl-4">
            <StatisticsWidget4
              className="card-xl-stretch mb-xl-8"
              svgIcon="basket"
              color="info"
              description="Sales Change"
              change="+256"
            />
          </div>

          <div className="col-xl-4">
            <StatisticsWidget4
              className="card-xl-stretch mb-xl-8"
              svgIcon="element-11"
              color="success"
              description="Weekly Income"
              change="750$"
            />
          </div>

          <div className="col-xl-4">
            <StatisticsWidget4
              className="card-xl-stretch mb-5 mb-xl-8"
              svgIcon="briefcase"
              color="primary"
              description="New Users"
              change="+6.6K"
            />
          </div>
        </div> */}
        {/* end::Row */}
      </Content>
    </>
  );
};

export { Statistics };
