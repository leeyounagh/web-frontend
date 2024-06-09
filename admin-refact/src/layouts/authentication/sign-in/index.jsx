import { useState } from "react";
import AxiosInstance from "../../../api/AxiosInstance";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function Basic() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const route = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 버튼 클릭");

    try {
      const response = await AxiosInstance.post("/admin/login", {
        email,
        password,
      });
      if(response.data.statusCode ===201){
        const token = response.headers['authorization'];
        if (token) {
          Cookies.set('token', token, { secure: true, sameSite: 'Strict' }); 
          // secure 옵션은 https에서만 쿠키를 전송할수 있도록함 (인증된 사이트에서만 이용가능)
          // sameSite 옵션은 쿠키를 전송할 사이트를 지정함
          // Strict 옵션은 쿠키를 전송할 사이트를 지정함
          route("/dashboard");
        } else {
          console.error('Token not found in response headers');
        }
      
      }
      console.log("응답", response.data);
    } catch (error) {
      console.log("로그인 에러", error.message);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
