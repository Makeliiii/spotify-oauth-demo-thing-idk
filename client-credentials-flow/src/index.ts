import got from "got";
import axios from "axios";
import qs from "querystring";

const getToken = async () => {
  const clientID = "no";
  const secret = "no";

  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: clientID,
      password: secret,
    },
  };

  const data = {
    grant_type: "client_credentials",
  };

  return axios
    .post("https://accounts.spotify.com/api/token", qs.stringify(data), headers)
    .then((response) => {
      console.log(response.data);
      return response.data.access_token;
    })
    .catch((err) => console.log(err));

  // am I retarded???????????
  /* const res = await got
    .post("https://accounts.spotify.com/api/token", {
      headers: {
        Authorization: `Basic ${Buffer.from(clientID).toString(
          "base64"
        )}:${Buffer.from(secret).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: {
        grant_type: "client_credentials",
      },
    })
    .json(); */
};

getToken()
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
