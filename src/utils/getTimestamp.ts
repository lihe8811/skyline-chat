export default function getTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}