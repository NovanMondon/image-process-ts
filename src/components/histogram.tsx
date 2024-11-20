import { Bar } from "react-chartjs-2";
import { Chart, LinearScale, BarElement, Tooltip } from "chart.js";

Chart.register(LinearScale, BarElement, Tooltip);

export type HistogramProp = {
  values: number[]
}

const Histogram = (arg: { prop: HistogramProp }) => {
  const tValues = arg.prop.values
  let tData: {}[] = []
  for (let i = 0; i < tValues.length; i++) {
    tData.push({ x: i, y: tValues[i] })
  }

  const chartData = {
    datasets: [
      {
        label: "Frequency",
        data: tData,
        borderWidth: 0,
        backgroundColor: "rgba(0, 128, 128, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
      },
    },
    barPercentage: 1.0,
    categoryPercentage: 1.0,
  } as const;

  return <Bar data={chartData} options={options} />;
};

export default Histogram;
