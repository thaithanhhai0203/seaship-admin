import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./schedule.scss";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Stack } from "@mui/material";
import ButtonBack from "../../../components/button/buttonBack";
import ButtonSchedule from "../../../components/button/buttonSchedule";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1300,
  height: 620,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 4,
};

export default function ScheduleMotor({ open, setOpen }) {
  const handleClose = () => setOpen(false);

  const [orderList, setOrderList] = useState([]);
  const [shipperList, setShipperList] = useState([]);
  const [orderSelected, setOrderSelected] = useState([]);
  const [shipperSelected, setShipperSelected] = useState([]);
  const [totalOrder, setTotalOrder] = React.useState(0);
  const [totalShipper, setTotalShipper] = React.useState(0);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/api/v1/orders/motorbike?filter=new"
        );
        if (result.data) {
          setOrderList(result.data?.orders);
          setTotalOrder(result.data?.orders.length);
        }
      } catch (error) {
        console.error(error);
      }
    };
    const getShippers = async () => {
      try {
        const result = await axios.get(
          "http://localhost:3000/api/v1/shippers?filter=on&search=motorbike"
        );
        if (result.data) {
          setShipperList(result.data?.shippers);
          setTotalShipper(result.data?.shippers.length)
        }
      } catch (error) {
        console.error(error);
      }
    };
    getOrders();
    getShippers();
  }, []);

  const columnOrders = [
    {
      field: "name",
      headerName: "????n h??ng",
      width: 160,
      renderCell: ({ row }) => {
        return row.cargo.name;
      },
    },
    {
      field: "weight",
      headerName: "Tr???ng l?????ng th???c t???",
      width: 110,
      renderCell: ({ row }) => {
        return `${row.cargo.weight}`;
      },
    },
    {
      field: "dimension",
      headerName: "Tr???ng l?????ng v???n chuy???n",
      width: 110,
      renderCell: ({ row }) => {
        return `${row.cargo.dimension}`;
      },
    },
    {
      field: "distance",
      headerName: "Kho???ng c??ch",
      width: 120,
      renderCell: ({ row }) => {
        return `${row.order_address.distance} km`;
      },
    },
    {
      field: "delivery_time",
      headerName: "Ng??y giao",
      width: 120,
      renderCell: ({ row }) => {
        return row.delivery_time.split("-").reverse().join("-");
      },
    },
    {
      field: "shipping_fee",
      headerName: "Ph?? ship",
      width: 90,
    },
  ];

  const columnShippers = [
    { field: "name", headerName: "H??? t??n", width: 150 },
    {
      field: "capacity",
      headerName: "Tr???ng l?????ng t???i ??a",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.vehicle.capacity} kg`;
      },
    },
    {
      field: "dimension",
      headerName: "Kh???i l?????ng t???i ??a",
      width: 130,
      renderCell: ({ row }) => {
        return `${row.vehicle.dimension} m3`;
      },
    },
  ];

  const creatSchedule = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/deliveries/motorbike",
        data
      );
      if (res.data) {
        toast.success("L???p l???ch th??nh c??ng");
        setOpen(false);
      }
    } catch (error) {
      toast.error("Kh??ng th??? l???p l???ch, vui l??ng ki???m tra l???i");
      console.error(error);
    }
  };

  const handleSubmit = () => {
    const data = {
      list_order: orderSelected,
      list_shipper: shipperSelected,
    };
    creatSchedule(data);
  };
  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modal"
        >
          <Box sx={style}>
            <div className="label">
              S???p x???p l???ch giao h??ng cho ph????ng ti???n xe m??y
            </div>
            <div className="box-list">
              <div className="list-order">
                <div className="label-add">Ch???n ????n h??ng</div>
                <div style={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    rows={orderList}
                    columns={columnOrders}
                    pageSize={50}
                    checkboxSelection
                    disableSelectionOnClick
                    hideFooterSelectedRowCount
                    hideFooterPagination
                    onSelectionModelChange={(item) => setOrderSelected(item)}
                    getRowId={(row) => row.id}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack
                          height="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          Danh s??ch ????n h??ng tr???ng
                        </Stack>
                      ),
                      NoResultsOverlay: () => (
                        <Stack
                          height="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          Danh s??ch ????n h??ng tr???ng
                        </Stack>
                      ),
                    }}
                  />
                  <span style={{padding: '10px', fontWeight: 300}}>T???ng ????n h??ng: {totalOrder}</span>
                </div>
              </div>
              <div className="list-shipper">
                <div className="label-add">Ch???n shipper</div>
                <div style={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    rows={shipperList}
                    columns={columnShippers}
                    pageSize={50}
                    checkboxSelection
                    disableSelectionOnClick
                    hideFooterSelectedRowCount
                    hideFooterPagination
                    onSelectionModelChange={(item) => setShipperSelected(item)}
                    getRowId={(row) => row.id}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack
                          height="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          Danh s??ch shipper tr???ng
                        </Stack>
                      ),
                      NoResultsOverlay: () => (
                        <Stack
                          height="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          Danh s??ch shipper tr???ng
                        </Stack>
                      ),
                    }}
                  />
                  <span style={{padding: '10px', fontWeight: 300}}>T???ng shipper: {totalShipper}</span>
                </div>
              </div>
            </div>
            <div className="btn-schedule">
              <ButtonBack label={"Quay l???i"} onClick={handleClose} />
              <ButtonSchedule label={"S???p x???p"} onClick={handleSubmit} />
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
}
