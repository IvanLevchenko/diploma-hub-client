import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "semantic-ui-react";
import { TokenPayload } from "../../../shared-types/types/token-payload";

import SessionContext from "./session-context";
import TokenHelper from "../../helpers/token-helper";
import Header from "../../components/header/header";

interface Props {
  children: JSX.Element;
}

function PrivateRoute(props: Props): JSX.Element {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean>();
  const [loading, setLoading] = useState(true);
  const [tokenPayload, setTokenPayload] = useState<TokenPayload>();

  const tokenHelper = new TokenHelper();

  useEffect(() => {
    tokenHelper
      .isTokenValid()
      .then((response) => {
        if (response.isAuthorized) {
          if (response.token) {
            tokenHelper.setToken(response.token);
          }

          setTokenPayload(response.tokenPayload);
          setLoading(false);
          setIsAuthorized(true);
        } else {
          navigate("/auth");
        }
      })
      .catch(() => {
        navigate("/auth");
      });
  }, [window.location.href]);

  return (
    <>
      <Loader active={loading} />
      {isAuthorized && (
        <>
          {tokenPayload && (
            <SessionContext.Provider value={tokenPayload}>
              <Header />
              {props.children}
            </SessionContext.Provider>
          )}
        </>
      )}
    </>
  );
}

export default PrivateRoute;
