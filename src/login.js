import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callApi } from "./utils.js";
import "./login.css";
import "bootstrap/dist/css/bootstrap.min.css"

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-text"></div>
    </div>
  )
}

const Form = (props) => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const setIsLoading = props.setIsLoading;
  // const users = [{ username: "Jane", password: "testpassword" }];
  const handleSubmit = (e) => {
    e.preventDefault();
    // const account = users.find((user) => user.username === username);

    const login_fb = (username, password, navigate) => {
      setIsLoading(true);
      const data = { email: username, password: password };
      const params = { people_num: 10, message_num: 300 };

      callApi("http://127.0.0.1:8000/login", "POST", { info: data, params: params })
        .then(data => {
          console.log("login data", data);
          setIsLoading(false);
          navigate("/home");
        });
    };

    login_fb(username, password, navigate);
    localStorage.setItem("authenticated", JSON.stringify(true));
    // navigate("/home");

  };
  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter email"
              onChange={(e) => setusername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}


const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      {isLoading ? <Loading /> : null}
      {isLoading ? null : <Form setIsLoading={setIsLoading} />}
    </div>
  );
};

export default Login;
