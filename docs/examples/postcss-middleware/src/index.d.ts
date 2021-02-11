declare module '*.scss' {
    type Styles = { [className: string]: string; } & { inject(): void; }
    export const styles: Styles;
    export const key: string;
    export const css: string;
    export default styles;
}
