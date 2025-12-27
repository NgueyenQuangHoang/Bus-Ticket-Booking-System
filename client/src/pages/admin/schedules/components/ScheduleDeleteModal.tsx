import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
};

// Animation Transition
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ScheduleDeleteModal({ open, onClose, onConfirm, itemName }: Props) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: { borderRadius: 16 }, // Rounded corners
      }}
    >
      <DialogTitle className="text-red-600 font-bold">
        Xác nhận xóa
      </DialogTitle>
      <DialogContent>
        <p className="text-gray-600">
          Bạn có chắc chắn muốn xóa lịch trình{" "}
          <span className="font-semibold text-gray-800">{itemName}</span> không?
          <br />
          Hành động này không thể hoàn tác.
        </p>
      </DialogContent>
      <DialogActions className="p-4">
        <Button 
            onClick={onClose} 
            color="inherit" 
            className="hover:bg-gray-100 rounded-lg px-4"
        >
          Hủy
        </Button>
        <Button 
            onClick={onConfirm} 
            variant="contained" 
            color="error"
            className="rounded-lg px-4 shadow-none"
        >
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
