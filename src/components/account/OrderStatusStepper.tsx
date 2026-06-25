import { Check } from 'lucide-react';
import { ORDER_STAGES, getStageIndex, formatOrderStatus } from '../../lib/orderStatus';

interface OrderStatusStepperProps {
  status: string;
  compact?: boolean;
  /** Admin mode: steps are clickable to update order status */
  interactive?: boolean;
  onStatusSelect?: (status: string) => void;
  disabled?: boolean;
}

export default function OrderStatusStepper({
  status,
  compact = false,
  interactive = false,
  onStatusSelect,
  disabled = false,
}: OrderStatusStepperProps) {
  const currentIndex = getStageIndex(status);

  if (status === 'cancelled' && !interactive) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
        This order was cancelled.
      </div>
    );
  }

  if (status === 'pending' && !interactive) {
    return (
      <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
        Order placed — awaiting confirmation. You will be notified once confirmed.
      </div>
    );
  }

  const showStepper =
    interactive || (status !== 'cancelled' && status !== 'pending');

  if (!showStepper) {
    return null;
  }

  return (
    <div className={compact ? 'py-2' : 'py-4'}>
      {interactive && status === 'cancelled' && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          This order was cancelled. Select a step below or use the status dropdown to reactivate.
        </div>
      )}
      {interactive && status === 'pending' && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800 mb-4">
          Order awaiting confirmation — click a step below to confirm and update status.
        </div>
      )}
      {interactive && (
        <p className="text-xs text-medium-brown mb-3 text-center">
          Click any step to update order status — customer is notified automatically
        </p>
      )}

      <div className="flex items-start justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-medium-brown/20 mx-8" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-gold transition-all duration-500 mx-8"
          style={{
            width:
              currentIndex >= 0
                ? `calc(${(currentIndex / (ORDER_STAGES.length - 1)) * 100}% - 4rem)`
                : '0%',
          }}
        />

        {ORDER_STAGES.map((stage, index) => {
          const isComplete = currentIndex >= 0 && index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isSelected = status === stage.key;
          const isClickable = interactive && !disabled && !isSelected;

          const circleClasses = `w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
            isComplete
              ? 'bg-gold border-gold text-dark-brown'
              : 'bg-white border-medium-brown/30 text-medium-brown'
          } ${isCurrent ? 'ring-2 ring-gold/40 ring-offset-2' : ''} ${
            isClickable ? 'hover:ring-2 hover:ring-gold/30 hover:ring-offset-1 cursor-pointer' : ''
          } ${disabled && interactive ? 'opacity-60' : ''}`;

          const labelClasses = `mt-2 text-xs text-center max-w-[72px] leading-tight ${
            isCurrent ? 'font-semibold text-dark-brown' : 'text-medium-brown'
          } ${isClickable ? 'group-hover:text-dark-brown' : ''}`;

          const stepContent = (
            <>
              <div className={circleClasses}>
                {isComplete && index < currentIndex ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              {!compact && <p className={labelClasses}>{stage.label}</p>}
            </>
          );

          return (
            <div
              key={stage.key}
              className={`relative flex flex-col items-center flex-1 z-10 ${
                isClickable ? 'group' : ''
              }`}
            >
              {interactive ? (
                <button
                  type="button"
                  onClick={() => onStatusSelect?.(stage.key)}
                  disabled={!isClickable}
                  title={isClickable ? `Mark as ${stage.label}` : stage.label}
                  className="flex flex-col items-center bg-transparent border-0 p-0 disabled:cursor-default"
                  aria-label={`Set status to ${stage.label}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {stepContent}
                </button>
              ) : (
                stepContent
              )}
            </div>
          );
        })}
      </div>
      {compact && currentIndex >= 0 && (
        <p className="text-sm text-dark-brown mt-3 text-center font-medium">
          {formatOrderStatus(status)}
        </p>
      )}
    </div>
  );
}
