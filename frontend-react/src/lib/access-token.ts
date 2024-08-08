const AuthToken = () => {
  const authRelatedData = localStorage.getItem("authTokens");
  const initialAuthToken = authRelatedData ? JSON.parse(authRelatedData) : null;
  const initialUser = initialAuthToken ? initialAuthToken.access : null;
  return initialUser;
};

export default AuthToken;
