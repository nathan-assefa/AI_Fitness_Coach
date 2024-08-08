import { useEffect, useRef, FC } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { KTIcon, toAbsoluteUrl } from "../../../helpers";
import { getCSSVariableValue } from "../../../assets/ts/_utils";
import { Dropdown1 } from "../../content/dropdown/Dropdown1";
import { useThemeMode } from "../../layout/theme-mode/ThemeModeProvider";
import { useFetchData } from "../../../../redux/components/useFetchUserData";

type Props = {
  className: string;
  chartColor: string;
  chartHeight: string;
};

var months: string[] = [];
var profits: number[] = [];

const MixedWidget8: FC<Props> = ({ className, chartColor, chartHeight }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { analyticsData } = useFetchData();

  months = Object.keys(analyticsData?.profit_by_month ?? {});
  profits = Object.values(analyticsData?.profit_by_month ?? {});

  const { mode } = useThemeMode();
  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const chart1 = new ApexCharts(
      chartRef.current,
      chart1Options(chartColor, chartHeight, months, profits)
    );
    if (chart1) {
      chart1.render();
    }

    return chart1;
  };

  useEffect(() => {
    const chart1 = refreshChart();

    return () => {
      if (chart1) {
        chart1.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartRef, mode]);

  return (
    <div className={`card ${className}`}>
      {/* begin::Beader */}
      <div className="card-header border-0 py-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Revenue</span>

          <span className="text-muted fw-semibold fs-7">Latest revenue</span>
        </h3>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className="card-body d-flex flex-column">
        {/* begin::Chart */}
        <div
          ref={chartRef}
          className="mixed-widget-5-chart card-rounded-top"
        ></div>
        {/* end::Chart */}

        {/* begin::Items */}
        <div className="mt-5">
          {/* begin::Item */}
          <div className="d-flex flex-stack mb-5">
            {/* begin::Section */}
            <div className="d-flex align-items-center me-2">
              {/* begin::Title */}
              <div>
                <a
                  href="#"
                  className="fs-6 text-gray-800 text-hover-primary fw-bold"
                >
                  Meal Plan
                </a>
                <div className="fs-7 text-muted fw-semibold mt-1">
                  meal plan revenue
                </div>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Section */}

            {/* begin::Label */}
            <div className="badge badge-light fw-semibold py-4 px-3">
              {analyticsData?.comparative_analysis.plan_comparison[0]?.total
                ? `$${analyticsData?.comparative_analysis.plan_comparison[0].total}`
                : "No revenue generated yet"}
            </div>
            {/* end::Label */}
          </div>
          {/* end::Item */}

          {/* begin::Item */}
          <div className="d-flex flex-stack mb-5">
            {/* begin::Section */}
            <div className="d-flex align-items-center me-2">
              {/* begin::Title */}
              <div>
                <a
                  href="#"
                  className="fs-6 text-gray-800 text-hover-primary fw-bold"
                >
                  Workout Plan
                </a>
                <div className="fs-7 text-muted fw-semibold mt-1">
                  workout plan revenue
                </div>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Section */}

            {/* begin::Label */}
            <div className="badge badge-light fw-semibold py-4 px-3">
              {analyticsData?.comparative_analysis.plan_comparison[1]?.total
                ? `$${analyticsData?.comparative_analysis.plan_comparison[1].total}`
                : "No revenue generated yet"}
            </div>
            {/* end::Label */}
          </div>
          {/* end::Item */}

          {/* begin::Item */}
          <div className="d-flex flex-stack">
            {/* begin::Section */}
            <div className="d-flex align-items-center me-2">
              {/* begin::Title */}
              <div className="py-1">
                <a
                  href="#"
                  className="fs-6 text-gray-800 text-hover-primary fw-bold"
                >
                  Meal + Workout Plan
                </a>

                <div className="fs-7 text-muted fw-semibold mt-1">
                  workout + meal plan revenue
                </div>
              </div>
              {/* end::Title */}
            </div>
            {/* end::Section */}

            {/* begin::Label */}
            <div className="badge badge-light fw-semibold py-4 px-3">
              {analyticsData?.comparative_analysis.plan_comparison[2]?.total
                ? `$${analyticsData?.comparative_analysis.plan_comparison[2].total}`
                : "No revenue generated yet"}
            </div>
            {/* end::Label */}
          </div>
          {/* end::Item */}
        </div>
        {/* end::Items */}
      </div>
      {/* end::Body */}
    </div>
  );
};

console.log(months);

const chart1Options = (
  chartColor: string,
  chartHeight: string,
  months: string[],
  profits: number[]
): ApexOptions => {
  const labelColor = getCSSVariableValue("--bs-gray-800");
  const strokeColor = getCSSVariableValue("--bs-gray-300");
  const baseColor = getCSSVariableValue("--bs-" + chartColor) as string;
  const lightColor = getCSSVariableValue("--bs-" + chartColor + "-light");

  return {
    series: [
      {
        name: "Net Profit",
        data: profits,
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "area",
      height: chartHeight,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    // fill1: {
    //   type: 'gradient',
    //   opacity: 1,
    //   gradient: {
    //     type: 'vertical',
    //     shadeIntensity: 0.5,
    //     gradientToColors: undefined,
    //     inverseColors: true,
    //     opacityFrom: 1,
    //     opacityTo: 0.375,
    //     stops: [25, 50, 100],
    //     colorStops: [],
    //   },
    // },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
      crosshairs: {
        show: false,
        position: "front",
        stroke: {
          color: strokeColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 65,
      labels: {
        show: false,
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return "$" + val + " thousands";
        },
      },
    },
    colors: [lightColor],
    markers: {
      colors: [lightColor],
      strokeColors: [baseColor],
      strokeWidth: 3,
    },
  };
};

export { MixedWidget8 };
