const Palette = {
    black: '#000000',
    white: '#FFFFFF',
    deepRed: '#8B0000',
    lightRed: '#B22222',
    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
};

export const Colors = {
    light: {
        background: Palette.white,
        surface: Palette.gray[50],
        card: Palette.white,
        text: Palette.gray[900],
        textSecondary: Palette.gray[500],
        primary: Palette.deepRed,
        border: Palette.gray[200],
        icon: Palette.gray[400],
        error: Palette.error,
        success: Palette.success,
        ...Palette,
    },
    dark: {
        background: Palette.gray[900],
        surface: Palette.gray[800],
        card: Palette.gray[800],
        text: Palette.gray[50],
        textSecondary: Palette.gray[400],
        primary: Palette.deepRed,
        border: Palette.gray[700],
        icon: Palette.gray[500],
        error: Palette.error,
        success: Palette.success,
        ...Palette,
    },
};

// For backward compatibility while migrating
export const LightColors = Colors.light;

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    huge: 48,
};

export const BorderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const Typography = {
    family: {
        regular: 'System',
        bold: 'System',
    },
    size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        huge: 32,
    },
};

export const Shadows = {
    light: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
};
