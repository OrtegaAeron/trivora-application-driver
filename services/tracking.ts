export interface TrackingProgress {
  distanceRemaining: string;
  etaMinutes: number;
  statusText: string;
}

export function calculateDriverProgress(step: number): TrackingProgress {
  switch (step) {
    case 0:
      return { distanceRemaining: '1.2 km', etaMinutes: 5, statusText: 'En Route to Passenger Pickup' };
    case 1:
      return { distanceRemaining: '500 m', etaMinutes: 2, statusText: 'Approaching Pickup Location' };
    case 2:
      return { distanceRemaining: '0 m', etaMinutes: 0, statusText: 'Arrived at Pickup Location' };
    case 3:
      return { distanceRemaining: '2.4 km', etaMinutes: 8, statusText: 'Trip in Progress to Destination' };
    case 4:
      return { distanceRemaining: '0 m', etaMinutes: 0, statusText: 'Arrived at Destination' };
    default:
      return { distanceRemaining: '0 m', etaMinutes: 0, statusText: 'Trip Completed' };
  }
}
