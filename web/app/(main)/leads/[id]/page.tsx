import { LeadScreen } from '@/src/screens/main/LeadScreen';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params;
  return <LeadScreen id={id} />;
}
