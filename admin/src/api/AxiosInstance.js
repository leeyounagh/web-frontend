import axios from "axios";
import Cookies from "js-cookie";

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ROOT_API_URL,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// 응답 인터셉터: 서버로부터의 모든 응답 후에 실행
AxiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers["Authorization"];
    if (newToken) {
      const tokenValue = newToken.split(" ")[1];
      Cookies.set("token", tokenValue, { secure: true,  sameSite: "Strict" });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // 토큰을 인위적으로 만료시키는 함수(테스트용)
// const expireToken = () => {
//   Cookies.remove("token");
// };

// setTimeout(expireToken, 10000);

export default AxiosInstance;