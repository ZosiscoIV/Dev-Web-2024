export interface FormData {
    firstName: string;
    lastName:  string;
    email:     string;
    phone:     string;
    password:  string;
    confirmPassword: string;
}

export function updateFormData(
    prev: FormData,
    name: keyof FormData,
    value: string
): FormData {
    return {
        ...prev,
        [name]: value,
    };
}

export type FetchFn = (
    input: RequestInfo,
    init?: RequestInit
) => Promise<Response>;

export interface SubmitResult {
    redirectTo?: string;
    errorMsg?:   string;
}

export async function submitRegistration(
    data: FormData,
    fetchFn: FetchFn
): Promise<SubmitResult> {
    if (data.password !== data.confirmPassword) {
        return { errorMsg: "Les mots de passe ne correspondent pas" };
    }

    const resp = await fetchFn("http://localhost:6942/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prenom:   data.firstName,
            nom:      data.lastName,
            email:    data.email,
            tel:      data.phone,
            password: data.password,
        }),
    });

    if (!resp.ok) {
        let err: { error?: string } = {};
        try { err = await resp.json(); } catch {}
        return { errorMsg: err.error || "Erreur lors de l'inscription" };
    }

    return { redirectTo: "/login" };
}
