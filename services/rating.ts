export async function submitPassengerRating(
  passengerId: string,
  rating: number,
  comment: string
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}
