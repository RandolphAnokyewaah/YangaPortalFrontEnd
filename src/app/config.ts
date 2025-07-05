// my email id: a.basit.k08@gmail.com | whats app: +923351758820

// config
const config: any = {
  APIBaseUrl: "http://localhost:5000/api",

};

const apiEndpoint: any = {
  USER_LOGIN: "/auth/login",
};

const LOCAL_STORAGE: any = {
  userToken: "userToken",
};

const defaultLang = "en";
const languages = [
  { "name": "English", "code": "en" },
  { "name": "Deutsch", "code": "de" },
]

export {
  config, apiEndpoint,
  defaultLang, languages,
  LOCAL_STORAGE
};
