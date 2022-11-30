/**
 * Getter's options.
 */
interface GetOptions {
    /**
     * If `true`, will remove the entry after being loaded, even if an error occurred.
     */
    destroy?: boolean;
    /**
     * If `true`, will remove the entry only if an error occurred.
     */
    destroyOnError?: boolean;
}

export { GetOptions };
