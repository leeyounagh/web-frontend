/* eslint-disable react-hooks/rules-of-hooks */
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import releaseTableData from "components/Tables/data/releaseTableData";
import Tables from "components/Tables";
import Footer from "examples/Footer";
import { Button, Box, Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../api";
import { useEffect, useState } from "react";

function index() {
  const { columns, rows } = releaseTableData();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  useEffect(() => {
    getRelease();
  }, [currentPage]);

  const getRelease = async () => {
    const options = {
      params: {
        page: currentPage,
        limit: rowsPerPage,
      },
    };
    const { data } = await fetchData(
      "/admin/updated-histories",
      "get",
      null,
      options
    );
    const { colums, rows } = releaseTableData(data);
    console.log("data", data);
  };
  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Tables title="Release Notes" columns={columns} rows={rows} />
      <Box display="flex" justifyContent="center" p={2}>
        <Pagination
          count={tableData.totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="secondary"
          sx={{ color: "white" }}
        />
      </Box>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Button
          variant="contained"
          color="dark"
          onClick={() => {
            navigate("/update?title=release");
          }}
        >
          Update
        </Button>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}

export default index;
