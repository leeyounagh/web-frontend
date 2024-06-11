// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

import { findAdmin } from "./util/findAdmin";
import { fetchData } from "./api";
import { useEffect, useState } from "react";

function Overview() {
  const [data, setData] = useState({});

  const returnUserProfile = async () => {
    const adminList = await fetchData("/admin");
    const admin = await findAdmin(adminList.admins);
    const adminProfile = await fetchData(`/admin/${admin.id}`);
    console.log("adminProfile", adminProfile);
    setData((prev) => ({
      ...prev,
      adminProfile: adminProfile,
      adminList: adminList,
    }));
  };

  const requestAdminList = async () => {
    const disabledAdmin = await fetchData("/admin");
    console.log("disabledAdmin", disabledAdmin);
  };

  console.log("data", data);
  useEffect(() => {
    returnUserProfile();
    requestAdminList();
  }, []);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="profile information"
                description="echoist 최고 권력자 어드민 계정입니다."
                info={{
                  fullName: data?.adminProfile?.name || "에코이스트",
                  email: data?.adminProfile?.email,
                  location: "KOREA",
                }}
                social={[
                  {
                    icon: <FacebookIcon />,
                    color: "facebook",
                  },
                  {
                    icon: <TwitterIcon />,
                    color: "twitter",
                  },
                  {
                    icon: <InstagramIcon />,
                    color: "instagram",
                  },
                ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid item xs={12} xl={4}>
              <ProfilesList
                title="어드민 요청 리스트"
                profiles={profilesListData}
                shadow={false}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
