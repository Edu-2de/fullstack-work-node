import Button from "../../../../components/button";
import Text from "../../../../components/text";

interface EventActionFooterProps {
    priceValue: number;
    formattedPrice: string;
    isOwner?: boolean;
    isCustomer: boolean;
    isCancelled: boolean;
    isPastEvent: boolean;
    isSoldOut: boolean;
    hasTicket?: boolean;
    isBuyLoading?: boolean;
    isDeleteLoading?: boolean;
    onDelete?: () => void;
    onEdit?: () => void;
    onCancelTicket?: () => void;
    onBuy?: () => void;
}

export default function EventActionFooter({
    priceValue,
    formattedPrice,
    isOwner,
    isCustomer,
    isCancelled,
    isPastEvent,
    isSoldOut,
    hasTicket,
    isBuyLoading,
    isDeleteLoading,
    onDelete,
    onEdit,
    onCancelTicket,
    onBuy,
}: EventActionFooterProps) {
    return (
        <div className="mt-auto pt-8 border-t border-white/10 flex justify-between w-full sm:items-center gap-12">
            <div className="flex flex-col">
                <Text
                    variant="text-sm"
                    className="text-gray-500 uppercase tracking-widest font-bold block mb-1"
                >
                    Valor do ingresso
                </Text>
                <span className="font-body text-4xl text-white font-bold tracking-tight">
                    {priceValue === 0 ? "Gratuito" : formattedPrice}
                </span>
            </div>

            {isOwner && !isPastEvent && (
                <div className="flex flex-col justify-center sm:flex-row items-center gap-4 w-full">
                    {isCancelled ? (
                        <Button
                            onClick={onDelete}
                            isLoading={isDeleteLoading}
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto h-14 px-12 text-lg border-error-base text-error-light hover:bg-error-base/10 transition-all"
                        >
                            Deletar Evento
                        </Button>
                    ) : (
                        <>
                            <Button
                                onClick={onEdit}
                                size="lg"
                                className="w-full sm:w-auto h-14 px-12 text-lg"
                            >
                                Editar Evento
                            </Button>
                        </>
                    )}
                </div>
            )}

            {isCustomer && (
                <div className="w-full sm:w-auto">
                    {isCancelled || isPastEvent ? (
                        <Button
                            disabled
                            variant="outline"
                            className="cursor-not-allowed border-error-base text-error-light"
                        >
                            Cancelado
                        </Button>
                    ) : hasTicket ? (
                        <Button
                            onClick={onCancelTicket}
                            variant="outline"
                            className="w-full sm:w-auto h-14 px-12 text-lg border-error-base text-error-light hover:bg-error-base/10"
                        >
                            Cancelar Ingresso
                        </Button>
                    ) : isSoldOut ? (
                        <Button
                            disabled
                            variant="outline"
                            className="cursor-not-allowed border-error-base text-error-light"
                        >
                            Ingressos Esgotados
                        </Button>
                    ) : (
                        <Button
                            onClick={onBuy}
                            isLoading={isBuyLoading}
                            className="w-full sm:w-auto h-14 px-12 text-lg"
                        >
                            Comprar Ingresso
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
