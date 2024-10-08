import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import "./FoodCard.css";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const FoodCard = ({ img_src, alt, title, editable, id }) => {
  const navigate = useNavigate();
  return (
    <Card className="food-card">
      <CardMedia
        component="img"
        height="140"
        image={img_src}
        alt={alt}
        onClick={() => navigate(`/recipe/view/${id}`)}
      />
      <CardContent className="card-content">
        <Typography
          variant="h6"
          component="a"
          href={`/recipe/view/${id}`}
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontStyle: "normal",
          }}
        >
          {title}
        </Typography>
        {editable && (
          <Button className="edit-button" variant="contained">
            <MdEdit />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodCard;
