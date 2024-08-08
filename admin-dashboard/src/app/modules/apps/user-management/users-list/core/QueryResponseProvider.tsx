import {
  FC,
  useContext,
  useState,
  useEffect,
  useMemo,
  useReducer,
  useCallback,
  createContext,
} from "react";
import { useQuery } from "react-query";
import {
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from "../../../../../../_metronic/helpers";
import { getUsers } from "./_requests";
import { useQueryRequest } from "./QueryRequestProvider";
import { User, UserListResponse } from "../../../../../../lib/types";
import { QueryResponseContextProps } from "../../../../../../_metronic/helpers";

// Create the context
const QueryResponseContext = createContext<QueryResponseContextProps<User>>(
  initialQueryResponse as QueryResponseContextProps<User>
);

type SearchState = {
  search: string;
  chatStatus: string;
  subscriptionStatus: string;
};

type SearchAction =
  | { type: "setSearch"; payload: string }
  | { type: "setChatStatus"; payload: string }
  | { type: "setSubscriptionStatus"; payload: string };

const searchReducer = (state: SearchState, action: SearchAction) => {
  switch (action.type) {
    case "setSearch":
      return { ...state, search: action.payload };
    case "setChatStatus":
      return { ...state, chatStatus: action.payload };
    case "setSubscriptionStatus":
      return { ...state, subscriptionStatus: action.payload };
    default:
      return state;
  }
};

const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  const [{ search, chatStatus, subscriptionStatus }, dispatch] = useReducer(
    searchReducer,
    {
      search: "",
      chatStatus: "",
      subscriptionStatus: "", // Corrected the initialization
    }
  );

  const setSearch = useCallback((search: string) => {
    dispatch({ type: "setSearch", payload: search });
  }, []);

  const setChatStatus = useCallback((status: string) => {
    dispatch({ type: "setChatStatus", payload: status });
  }, []);

  const setSubscriptionStatus = useCallback((status: string): {} => {
    dispatch({ type: "setSubscriptionStatus", payload: status });
    return {};
  }, []);

  useEffect(() => {
    if (query !== updatedQuery) {
      setQuery(updatedQuery);
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(`${QUERIES.USERS_LIST}-${query}`, () => getUsers(query), {
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  console.log(response);

  const filteredUsers = useMemo(
    () =>
      (response as UserListResponse)?.users?.filter((user: User) => {
        const matchesSearch = `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesChatStatus =
          !chatStatus || user.chat_status === chatStatus;
        const matchesSubscriptionStatus =
          !subscriptionStatus ||
          user.subscription_status === subscriptionStatus;
        return matchesSearch && matchesChatStatus && matchesSubscriptionStatus;
      }) || [],
    [response, search, chatStatus, subscriptionStatus]
  );

  return (
    <QueryResponseContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        // @ts-ignore: Ignore the type error for this line
        response: { ...response, users: filteredUsers },
        query,
        search,
        setSearch,
        chatStatus,
        setChatStatus,
        subscriptionStatus,
        setSubscriptionStatus,
      }}
    >
      {children}
    </QueryResponseContext.Provider>
  );
};

const useQueryResponse = () => useContext(QueryResponseContext);

const useQueryResponseData = () => {
  const { response } = useQueryResponse();
  if (!response) {
    return [];
  }

  return (response as UserListResponse)?.users || [];
};

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useQueryResponse();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse();
  return isLoading;
};

const useQuerySearch = () => {
  const { search, setSearch } = useQueryResponse();
  return { search, setSearch };
};

const useChatStatus = () => {
  const { chatStatus, setChatStatus } = useQueryResponse();
  return { chatStatus, setChatStatus };
};

const useSubscriptionStatus = () => {
  const { subscriptionStatus, setSubscriptionStatus } = useQueryResponse();
  return { subscriptionStatus, setSubscriptionStatus };
};

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
  useQuerySearch,
  useChatStatus,
  useSubscriptionStatus,
};
