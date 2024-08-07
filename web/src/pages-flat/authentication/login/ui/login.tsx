import React, { useEffect, useState } from "react";
import { PrevButton } from "@/shared/ui/button";
import DefaultLayout from "../../ui/layout/defaultLayout";
import TextField from "../../ui/contents/textfield";
import InputField from "../../ui/contents/inputfield";
import Check from "@/shared/ui/check/check";
import styled from "styled-components";
import color from "@/shared/styles/color";
import ButtonFieldLayout from "../../ui/layout/buttonFieldLayout";
import { Button } from "@/shared/ui/button";
import SocialLoginField from "./content/SocialLoginField";
import Link from "next/link";
import { checkFirstLogin, localLogin, socialLogin } from "../api";
import { GeneralToast } from "@/shared/ui/toast";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";

type SocialLoginName = "google" | "kakao" | "naver";

const CheckboxContainer = styled.fieldset`
  display: flex;
  align-items: center;
  position: absolute;
  top: 385px;
`;

const P = styled.p<{ $loginCheck: boolean }>`
  color: ${({ $loginCheck }) => ($loginCheck ? color.pointcolor : "#484848")};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%;
`;
const Nav = styled.nav`
  width: 100%;
  padding-top: 24px;
`;
const Ul = styled.ul`
  display: flex;
  justify-content: center;
  gap: 26px;
`;
const Li = styled.li`
  list-style-type: none;
  color: #919191;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 18px */
  text-decoration-line: underline;
  cursor: pointer;
`;

export const Login = () => {
  const token = useSearchParams().get("token");
  const [infoData, setInfoData] = useState({
    id: { value: "", placeholder: "이메일 주소 또는 아이디" },
    password: { value: "", placeholder: "비밀번호" },
  });
  const [autoLoginCheck, setAutoLoginCheck] = useState(false);
  const [isShowToast, setIsShowToast] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token') || sessionStorage.getItem('token');
    if (token) {
      router.push('/web/main');
    }
  }, [router]);

  useEffect(() => {
    const handleLogin = async () => {
      const tenYearsFromNow = new Date(
        new Date().setFullYear(new Date().getFullYear() + 10)
      );

      const redirectToPage = (isFirstLogin: boolean) => {
        if (isFirstLogin) {
          router.push("/web/complete");
        } else {
          router.push("/web/main");
        }
      };

      if (token) {
        try {
          if (autoLoginCheck) {
            Cookies.set("token", token, {
              expires: tenYearsFromNow,
              secure: true,
              sameSite: "Strict",
            });
          } else {
            sessionStorage.setItem("token", token);
          }

          const isFirstLogin = await checkFirstLogin();
          redirectToPage(isFirstLogin);
        } catch (error) {
          console.error("Error checking first login:", error);
        }
      } else {
        console.error("No token found");
      }
    };

    handleLogin();
  }, [token, autoLoginCheck, router]);

  const isValidButton =
    infoData.id.value.length > 0 && infoData.password.value.length > 0;

  const submitLogin = async () => {
    setIsShowToast(false);
    const body = {
      email: infoData.id.value,
      password: infoData.password.value,
    };
    try {
      const statusCode = await localLogin(body, autoLoginCheck);
      if (statusCode === 200 || statusCode === 201) {
        //메인페이지
        const isFistLogin = await checkFirstLogin();
        if (isFistLogin) {
          router.push("/web/complete");
        } else {
          router.push("/web/main");
        }
      }
    } catch (err) {
      console.log("err", err);
      if (err) {
        setIsShowToast(true);
      }
    }
  };

  const submitSocialLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { name } = e.currentTarget as HTMLButtonElement;
    const linkmapper = {
      google: "/googleAuth",
      kakao: "/kakaoAuth",
      naver: "/naverAuth",
      apple: "/appleAuth",
    };

    socialLogin(linkmapper[name as SocialLoginName]);
  };

  return (
    <DefaultLayout>
      <PrevButton />
      {isShowToast && (
        <GeneralToast
          title="로그인에 실패 했습니다."
          desc="아이디와 비밀번호를 확인해주세요."
          isShowToast={isShowToast}
          setIsShowToast={setIsShowToast}
        />
      )}

      <TextField
        title="안녕하세요!"
        title2="링크드아웃에 오신 것을 환영합니다."
      />
      <InputField data={infoData} setData={setInfoData} />
      <CheckboxContainer>
        <Check
          check={autoLoginCheck}
          setCheck={setAutoLoginCheck}
          type="general"
        />
        <P $loginCheck={autoLoginCheck}>자동로그인</P>
      </CheckboxContainer>
      <ButtonFieldLayout>
        <Button
          text="로그인"
          style="square"
          scale="large"
          type={isValidButton ? "point" : "disable"}
          onClick={isValidButton ? submitLogin : undefined}
        />
        <Nav>
          <Ul>
            <Li>아이디 찾기</Li>
            <Li>비밀번호 재설정</Li>
            <Link href="/web/signup">
              <Li>회원가입</Li>
            </Link>
          </Ul>
        </Nav>
        <SocialLoginField submitSocialLogin={submitSocialLogin} />
      </ButtonFieldLayout>
    </DefaultLayout>
  );
};
