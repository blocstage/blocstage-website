import BuyTicketsPage from "@/components/BuyTicketPage";

export default function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const eventId = searchParams.eventId as string;

    if (!eventId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
                    <p className="text-gray-600">Event ID is missing from the URL.</p>
                </div>
            </div>
        );
    }

    return <BuyTicketsPage eventId={eventId} />;
}
