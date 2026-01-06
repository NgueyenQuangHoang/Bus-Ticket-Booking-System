import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props<T> = {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
};

export default function BusCompanyAction<T>({
  item,
  onEdit,
  onDelete,
}: Props<T>) {
  return (
    <div className="flex items-center justify-center gap-4">
      {onEdit && (
        <EditIcon
          onClick={() => onEdit(item)}
          className="text-green-500 cursor-pointer hover:scale-110 transition"
          sx={{ fontSize: 20 }}
        />
      )}

      {onDelete && (
        <DeleteIcon
          onClick={() => onDelete(item)}
          className="text-red-500 cursor-pointer hover:scale-110 transition"
          sx={{ fontSize: 20 }}
        />
      )}
    </div>
  );
}
