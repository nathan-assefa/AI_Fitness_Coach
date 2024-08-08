import clsx from "clsx";
import { toAbsoluteUrl } from "../../../../helpers";
import { useFetchData } from "../../../../../redux/components/useFetchUserData";

type Props = {
  className: string;
  description: string;
  icon: boolean;
  stats: number;
  labelColor: string;
  textColor: string;
};

const items: Array<{
  name: string;
  initials?: string;
  src?: string;
  state?: string;
}> = [
  { name: "Alan Warden", initials: "A", state: "warning" },
  { name: "Michael Eberon", src: toAbsoluteUrl("media/avatars/300-11.jpg") },
  { name: "Susan Redwood", initials: "S", state: "primary" },
  { name: "Melody Macy", src: toAbsoluteUrl("media/avatars/300-2.jpg") },
  { name: "Perry Matthew", initials: "P", state: "danger" },
  { name: "Barry Walter", src: toAbsoluteUrl("media/avatars/300-12.jpg") },
];

const CardsWidget7 = ({
  className,
  description,
  stats,
  labelColor,
  textColor,
}: Props) => {
  const { unsubscribedUserList, isLoading, error } = useFetchData();
  return (
    <div className={`card card-flush ${className}`}>
      <div className="card-header pt-5">
        <div className="card-title d-flex flex-column">
          <div className="card-title d-flex flex-column">
            <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
              {unsubscribedUserList?.count}
            </span>
            <span className="text-gray-500 pt-1 fw-semibold fs-6">
              {description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export { CardsWidget7 };
