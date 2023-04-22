import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callApi } from "./utils.js";

const Loading = () => {
  return (
    <div>
      <h1>
        Loading...
      </h1>
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
    <div>
      <p>Welcome Back</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Username"
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <input
          type="password"
          name="Password"
          onChange={(e) => setpassword(e.target.value)}
        />
        <input type="submit" value="Submit" />
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
