/* eslint-disable react-hooks/rules-of-hooks */
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import BackgroudCard from "components/BackgroundCard";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchData } from "../../../api";
import EditModal from "../components/EditModal";
import { showToast } from "../../../utils/toast";
import { Button } from "@mui/material";

export default function Index() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [data, setData] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    editProfile();
    getDetail();
  }, [id]);

  const getDetail = async () => {
    try {
      const { data } = await fetchData(`/admin/essays/${id}`, "get");
      setData(data);
    } catch (error) {
      console.error("user detail error", error);
    }
  };
  const editProfile = async () => {
    if (!data || !data.editedProfile) {
      return;
    }
    const body = Object?.keys(data?.editedProfile).reduce((acc, key) => {
      acc[key] = data?.editedProfile[key];
      return acc;
    }, {});
    try {
      const editProfile = await fetchData(`/admin/essays/${id}`, "put", body);
      if (editProfile.status === 200) {
        showToast.success("유저정보가 업데이트되었습니다.");
        setData((prev) => ({
          ...prev,
          adminProfile: editProfile.data,
        }));
        setEditModalOpen(false);
      }
    } catch (err) {
      showToast.error("유저정보가 변경되지 않았습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      editedProfile: {
        ...prev.editedProfile,
        [name]: value,
      },
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <EditModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        data={data.editedProfile || {}}
        setData={setData}
        onChange={handleChange}
        editProfile={editProfile}
      />
      <BackgroudCard
        btnTitle="List"
        link="/reports"
        optionalBtnTitle="Edit"
        optionalBtnLink="#"
        setEditModalOpen={setEditModalOpen}
      >
        <MDBox p={3}>
          <MDTypography variant="h3">Essay Detail</MDTypography>
          <hr
            style={{
              marginTop: "10px",
              borderTop: "1px solid lightgray",
              marginBottom: "20px",
              width: "100%",
            }}
          />
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6} container alignItems="center">
              <Grid item>
                {data.thumbnail ? (
                  <img
                    src={data.thumbnail}
                    alt="profile"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginBottom: "10px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  >
                    No image
                  </div>
                )}
              </Grid>
              <Grid item style={{ marginLeft: "20px" }}>
                <MDTypography variant="h4" color="secondary">
                  {data?.title || "---"}
                </MDTypography>
                <MDTypography variant="body1" color="secondary">
                  {data?.author?.nickname || "---"}
                </MDTypography>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} container justifyContent="flex-end">
              <Button
                color="white"
                onClick={() => navigate(`/user-detail?id=${data?.author?.id}`)}
                style={{ fontSize: "20px", marginTop: "10px" }}
              >
                👉 Author Info
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} marginTop={4}>
              <MDTypography variant="h5" color="secondary">
                Content
              </MDTypography>
              <MDBox
                sx={{
                  width: "100%",
                  height: "150px",
                  overflowY: "auto",
                  whiteSpace: "pre-line",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                }}
              >
                <MDTypography variant="body2">
                  {data.content || "---"}
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                LinkedOut Gauge
              </MDTypography>
              <MDTypography variant="body2">
                {data.linkedOutGauge || "---"}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                Views
              </MDTypography>
              <MDTypography variant="body2">{data.views || 0}</MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                Updated Date
              </MDTypography>
              <MDTypography variant="body2">
                {data.updatedDate || "---"}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                Created Date
              </MDTypography>
              <MDTypography variant="body2">
                {data.createdDate || "---"}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                Status
              </MDTypography>
              <MDTypography variant="body2">
                {data.status || "---"}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                Device
              </MDTypography>
              <MDTypography variant="body2">
                {data.device || "---"}
              </MDTypography>
            </Grid>
          </Grid>
          <hr
            style={{
              marginTop: "30px",
              borderTop: "1px solid lightgray",
              marginBottom: "20px",
              width: "100%",
            }}
          />
          <MDTypography variant="h3" color="secondary" marginBottom="30px">
            Story
          </MDTypography>
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={12}>
              <MDTypography variant="h5" color="secondary">
                Story Name
              </MDTypography>
              <MDTypography variant="body2">
                {data?.story?.name || "---"}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                Updated Date
              </MDTypography>
              <MDTypography variant="body2">
                {data?.story?.updatedDate || "---"}
              </MDTypography>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDTypography variant="h5" color="secondary">
                Created Date
              </MDTypography>
              <MDTypography variant="body2">
                {data?.story?.createdDate || "---"}
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
      </BackgroudCard>
      <Footer />
    </DashboardLayout>
  );
}
