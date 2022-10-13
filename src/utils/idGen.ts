export function generateID(): string {
    return (
        String(Math.floor(Math.random() ** 2 * 1_000_000_000))
        + String(Math.floor(Math.random() ** 2 * 1_000_000_000))
    )
}