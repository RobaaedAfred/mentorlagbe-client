import TuitionDetails from "@/components/TuitionDetails";

export const metadata = { title: "Tuition Details" };

export default function TuitionDetailsPage({ params }: { params: { id: string } }) {
  return <TuitionDetails id={params.id} />;
}