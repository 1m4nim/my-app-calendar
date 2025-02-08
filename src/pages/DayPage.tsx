import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const DayPage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>{date} の詳細</h2>
      <button onClick={() => navigate("/")}>カレンダーに戻る</button>
    </div>
  );
};

export default DayPage;
