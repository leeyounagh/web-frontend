/* eslint-disable react-hooks/rules-of-hooks */
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import BackgroudCard from "components/BackgroundCard";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchData } from "../../../api";
import EditModal from "../components/EditModal";
import { showToast } from "../../../utils/toast";

function Index() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [data, setData] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    getDetail();
    editProfile();
  }, [id]);

  const getDetail = async () => {
    try {
      const { data } = await fetchData(`/admin/users/${id}`, "get");
      setData(data);
    } catch (error) {
      console.error("user detail error", error);
    }
  };

  const editProfile = async () => {
    if (!data || !data.editedProfile) {
      return;
    }
    const body = Object.keys(data.editedProfile).reduce((acc, key) => {
      acc[key] = data.editedProfile[key];
      return acc;
    }, {});

    try {
      const editProfile = await fetchData(`/admin/users/${id}`, "put", body);

      if (editProfile.status === 200) {
        showToast.success("유저정보가 업데이트되었습니다.");
        setData((prev) => ({
          ...prev,
          adminProfile: editProfile.data,
        }));
        getDetail();
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
        data={data}
        setData={setData}
        onChange={handleChange}
        editProfile={editProfile}
      />
      <BackgroudCard
        btnTitle="list"
        link={`/users`}
        optionalBtnTitle="edit"
        optionalBtnLink="#"
        setEditModalOpen={setEditModalOpen}
      >
        <MDBox p={8}>
          <Grid container marginLeft={6} marginBottom={4} alignItems="center">
            <Grid>
              <Grid container justifyContent="center" alignItems="center">
                {data.profileImage ? (
                  <img
                    src={data.profileImage}
                    alt="profile"
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
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
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  >
                    No image
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid item xs={6} marginLeft={4}>
              <Grid container direction="column" alignItems="flex-start">
                <Grid item>
                  <MDTypography variant="h4" marginBottom="5px">
                    {data.nickname ? data.nickname : "---"}
                  </MDTypography>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <MDTypography variant="body2">
                        {data.email ? data.email : "---"}
                      </MDTypography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <hr
            style={{
              marginTop: "20px",
              borderTop: "1px solid lightgray",
              marginBottom: "20px",
              width: "100%",
            }}
          />
          <section>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Email:
              </MDTypography>
              <MDTypography variant="h6">
                {data.email ? data.email : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Gender:
              </MDTypography>
              <MDTypography variant="h6">
                {data.gender ? data.gender : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Birth Date:
              </MDTypography>
              <MDTypography variant="h6">
                {data.birthDate ? data.birthDate : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Status:
              </MDTypography>
              <MDTypography variant="h6">
                {data.status ? data.status : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Reputation:
              </MDTypography>
              <MDTypography variant="h6">
                {data.reputation ? data.reputation : "---"}
              </MDTypography>
            </div>
          </section>

          <hr
            style={{
              marginTop: "20px",
              borderTop: "1px solid lightgray",
              marginBottom: "20px",
              width: "100%",
            }}
          />
          <section>
            <MDTypography variant="h3" marginBottom="10px">
              Other Details
            </MDTypography>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Role:
              </MDTypography>
              <MDTypography variant="h6">
                {data.role ? data.role : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Subscription End:
              </MDTypography>
              <MDTypography variant="h6">
                {data.subscriptionEnd ? data.subscriptionEnd : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Created Date:
              </MDTypography>
              <MDTypography variant="h6">
                {data.createdDate ? data.createdDate : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Updated Date:
              </MDTypography>
              <MDTypography variant="h6">
                {data.updatedDate ? data.updatedDate : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Deleted Date:
              </MDTypography>
              <MDTypography variant="h6">
                {data.deletedDate ? data.deletedDate : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Report Count:
              </MDTypography>
              <MDTypography variant="h6">
                {data.reportCount ? data.reportCount : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Review Count:
              </MDTypography>
              <MDTypography variant="h6">
                {data.reviewCount ? data.reviewCount : "---"}
              </MDTypography>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <MDTypography variant="body2" color="secondary">
                Essay Count:
              </MDTypography>
              <MDTypography variant="h6">
                {data.essayCount ? data.essayCount : "---"}
              </MDTypography>
            </div>
          </section>
        </MDBox>
      </BackgroudCard>
      <Footer />
    </DashboardLayout>
  );
}

export default Index;
