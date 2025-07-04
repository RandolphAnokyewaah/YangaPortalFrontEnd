// config
const config: any = {
  APIBaseUrl: "https://yanga-api.up.railway.app/api",
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
