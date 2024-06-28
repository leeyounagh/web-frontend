/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MDEditor from "@uiw/react-md-editor";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import { Typography } from "@mui/material";
import MDBox from "components/MDBox";
import { fetchData } from "../../api";
import { showToast } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function index() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  const [value, setValue] = useState({ title: "", content: "" });
  const navigate = useNavigate();


  console.log("value",value)


  useEffect(() => {
    if (id) {
      getDetail();
    }
  }, [id]);

  const payloads = {
    notice: {
      body: {
        title: value.title,
        content: value.content,
      },
      endpoint: id ? `/admin/notices/${id}` : "/admin/notices",
      successMessage: id
        ? "notice edited successfully"
        : "notice updated successfully",
      method: id ? "put" : "post",
    },
    inquire: {
      body: {
        answer: value.answer,
      },
      endpoint: id ? `/admin/inquiries/${id}` : "/admin/inquiries",
      successMessage: id
        ? "inquire edited successfully"
        : "inquire updated successfully",
      method: "post",
    },
  };
//릴리즈도 추가하기
  const getDetail = async () => {
    try {
      const { endpoint } = payloads[title];
      const { data, status } = await fetchData(endpoint, "get");
      if (status === 200) {
        setValue((prev) => ({
          ...prev,
          inquire: title === "inquire" ? true : false,
          title: data.title,
          content: data.content,
          date: data?.createdDate?.slice(0.1),
          answer: data?.answer || "",
          user: title === "inquire" ? data.user : {},
        }));
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const updateData = async () => {
    const handleResponse = (status, successMessage) => {
      if (status === 200 || status === 201) {
        showToast.success(successMessage);
        navigate(-1);
      } else {
        showToast.error("update failed.");
      }
    };

    try {
      const { body, endpoint, successMessage, method } =
        payloads[title] || payloads.notice;
      const { status } = await fetchData(endpoint, method, body);
      handleResponse(status, successMessage);
    } catch (err) {
      showToast.error("update failed.");
    }
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid item xs={12}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                update
              </MDTypography>
            </MDBox>
          </Card>
        </Grid>
      </MDBox>
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          minHeight: "40rem",
          marginTop: "20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                paddingLeft: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #ccc",
                padding: "20px",
                boxShadow: 1,
                overflow: "auto",
              }}
            >
              {/* 미리보기 자리 | 문의글 보기 */}
              {value.inquire ? (
                <Box sx={{ fontSize: "0.8rem" }}>
                  <Typography
                    sx={{ marginBottom: "0.2rem", fontSize: "0.9rem" }}
                  >
                    제목: {value?.title}
                  </Typography>
                  <hr
                    style={{
                      marginTop: "10px",
                      borderTop: "1px solid lightgray",
                      width: "100%",
                    }}
                  />
                  <Typography
                    sx={{
                      marginBottom: "1rem",
                      fontSize: "0.8rem",
                      marginTop: "8px",
                    }}
                  >
                    name: {value?.user?.nickname}
                  </Typography>

                  <Typography sx={{ fontSize: "0.9rem" }}>
                    {value?.content}
                  </Typography>
                </Box>
              ) : (
                <MDEditor.Markdown
                  source={value.content}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            {!value.inquire && (
              <TextField
                label="제목"
                placeholder="제목을 입력하세요..."
                variant="outlined"
                value={value.title}
                onChange={(e) =>
                  setValue((prev) => ({ ...prev, title: e.target.value }))
                }
                style={{
                  width: "100%",
                  marginBottom: "10px",
                  backgroundColor: "white",
                }}
                InputLabelProps={{ shrink: true }}
              />
            )}

            <Box
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <MDEditor
                  value={value.inquire ? value?.answer : value.content}
                  onChange={(newValue) =>
                    setValue((prev) => ({
                      ...prev,
                      [value.inquire ? "answer" : "content"]: newValue,
                    }))
                  }
                  height={600}
                  preview={title === "inquire" ? "live" : "edit"}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button variant="contained" color="dark" onClick={updateData}>
          Update
        </Button>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default index;
