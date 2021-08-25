import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Label, Legend, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#CEE5D0"];

function MyPieChart() {
  const [myData, setMyData] = useState([]);
  const [activePosition, setActivePosition] = useState("Associate Consultant");

  // load in all data
  useEffect(() => {
    (async function getData() {
      const response = await fetch("data/pool-1.json");
      const resData = await response.json();
      setMyData(resData);
    })();
  }, []);

  // filter active data based on selected position (will display all employees at selected designation)
  const activeData = myData.filter((user) => user.position === activePosition);

  // create render data for piechart
  const renderData = [];
  for (let i = 1; i <= 5; i++) {
    renderData.push({
      name: `${i.toString()}`,
      value: activeData.filter((user) => user.score === i).length,
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{
            background: "tomato",
            opacity: ".9",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <p className="label">{`Score ${payload[0].name} : ${payload[0].value} employee(s)`}</p>
          <ul className="desc">
            {activeData
              .filter((user) => user.score === Number(payload[0].name))
              .map((user) => (
                <li key={user._id}>{user.name}</li>
              ))}
          </ul>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        border: "1px solid green",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ border: "1px solid red", width: 300, marginRight: 20 }}>
        <PieChart width={300} height={300}>
          <Legend align="right" verticalAlign="middle" layout="vertical" />
          <Pie
            data={renderData}
            cx={120}
            cy={150}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {renderData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label width={30} position="center">
              {activePosition + "s"}
            </Label>
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </div>

      <div className="content-container">
        <h2>{`Total Employees in Pool: ${myData.length}`}</h2>
        <h3>{`Total ${activePosition}s: ${activeData.length}`}</h3>
        <hr />
        <form className="selection-container">
          <label htmlFor="position">Choose Designation:</label>
          <select
            id="position"
            onChange={(e) => setActivePosition(e.target.value)}
          >
            <option name="b1">Associate Consultant</option>
            <option name="b2">Consultant</option>
            <option name="c1">Senior Consultant</option>
            <option name="c2">Manager</option>
            <option name="d1">Senior Manager</option>
          </select>
        </form>
      </div>
    </div>
  );
}

export default MyPieChart;
