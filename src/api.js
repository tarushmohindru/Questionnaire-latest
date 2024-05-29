import axios from "axios";

const url = "https://csip.eu.pythonanywhere.com";

//auth functions

/** Sign up new user. Password2 is the confirm password field. Both should be same */
export const signup = async (username, password1, password2, orgKey) => {
  let data = JSON.stringify({
    username: username,
    password1: password1,
    password2: password2,
    org_key: orgKey,
  });
  try {
    let res = await axios.post(url + "/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (e) {
    return e;
  }
};

/** Login the user */
export const login = async (username, password, orgKey) => {
  let data = JSON.stringify({
    username: username,
    password: password,
    org_key: orgKey,
  });

  try {
    let res = await axios.post(url + "/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (e) {
    return e;
  }
};

/** Logut the user, alternatively just redirect to '/' */
export const logout = async () => {
  try {
    await axios.get(url + "/logout");
  } catch (e) {
    return e;
  }
};

//crud functions

/**Return all questionnaires available in db for the logged in user */
export const getQList = async (jwtToken) => {
  try {
    let res = await axios.get(url + "/qlist", {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return res.data;
  } catch (e) {
    return e;
  }
};

/**Get questionnare by its id, can be accessed even if the user does not have access */
export const getQByQID = async (id, jwtToken) => {
  try {
    let res = await axios.get(`${url}/q/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return res.data;
  } catch (e) {
    return e;
  }
};

/**Get a new questionnare for the user */
export const getNewQ = async (jwtToken) => {
  try {
    let res = await axios.get(`${url}/q/new`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return res.data;
  } catch (e) {
    return e;
  }
};

export const saveAnswer = async (qid, jwtToken, payload) => {
  try {
    let res = await axios.post(`${url}/ans/${qid}`, payload, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return res.data;
  } catch (e) {
    return e;
  }
};
