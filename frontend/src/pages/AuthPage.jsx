import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, registerUser } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import AuthSplit from "../components/AuthSplit";
import Button from "../components/Button";
import FieldError from "../components/FieldError";
import { fieldClass, fieldControlClass, withFieldError } from "../lib/formClasses";
import { apiErrorMessage } from "../lib/apiError";
import { safeDashboardPath } from "../lib/navigation";

function SegmentedControl({ label, value, onChange, options }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid grid-cols-2 rounded-xl bg-slate-100 p-1"
    >
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-disabled={option.disabled || undefined}
            disabled={option.disabled}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={[
              "rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
              option.disabled
                ? "cursor-not-allowed text-slate-400"
                : checked
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900",
            ].join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const portal = searchParams.get("portal") === "admin" ? "admin" : "student";
  const mode = location.pathname.startsWith("/register") && portal === "student" ? "signup" : "login";

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    university: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const next = safeDashboardPath(searchParams.get("next"));

  const copy = useMemo(() => {
    if (portal === "admin") {
      return {
        title: "Admin portal",
        subtitle: "Staff sign in here. Student accounts use the student portal.",
      };
    }
    if (mode === "signup") {
      return {
        title: "Create student account",
        subtitle:
          "Offer or join campus rides with other students. Bikes and cars both work. Seats stay at two.",
      };
    }
    return {
      title: "Log in to CoRide Finder",
      subtitle: "Use your student account to offer or join a campus ride.",
    };
  }, [mode, portal]);

  const goTo = useCallback(
    (nextMode, nextPortal) => {
      const params = new URLSearchParams(searchParams);
      if (nextPortal === "admin") {
        params.set("portal", "admin");
      } else {
        params.delete("portal");
      }
      const path = nextMode === "signup" && nextPortal !== "admin" ? "/register" : "/login";
      const query = params.toString();
      navigate({ pathname: path, search: query ? `?${query}` : "" }, { replace: true });
    },
    [navigate, searchParams]
  );

  useEffect(() => {
    if (portal === "admin" && location.pathname.startsWith("/register")) {
      goTo("login", "admin");
    }
  }, [goTo, location.pathname, portal]);

  const handleChange = (e) => {
    setFormError("");
    setFieldErrors((current) => ({ ...current, [e.target.name]: "" }));
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (mode === "signup") {
      const nextErrors = {};
      if (form.password !== form.confirm_password) {
        nextErrors.confirm_password = "Passwords do not match.";
      }
      if (form.password.length < 8) {
        nextErrors.password = "Use at least 8 characters.";
      }
      if (Object.keys(nextErrors).length) {
        setFieldErrors(nextErrors);
        return;
      }
    }

    try {
      setSubmitting(true);
      if (mode === "signup") {
        const payload = {
          full_name: form.full_name.trim(),
          university: form.university.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || undefined,
        };
        await registerUser(payload);
        const data = await loginUser({
          email: payload.email,
          password: payload.password,
          portal: "student",
        });
        login(data.access_token, data.refresh_token, data.role);
      } else {
        const data = await loginUser({
          email: form.email.trim(),
          password: form.password,
          portal,
        });
        login(data.access_token, data.refresh_token, data.role);
      }
      navigate(next, { replace: true });
    } catch (error) {
      setFormError(
        apiErrorMessage(
          error,
          mode === "signup"
            ? "Could not create your account. Check the details and try again."
            : "Email or password is incorrect. Try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthSplit>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{copy.title}</h1>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">{copy.subtitle}</p>

      <div className="mt-6 space-y-3">
        <SegmentedControl
          label="Portal"
          value={portal}
          onChange={(value) => {
            setFormError("");
            goTo(value === "admin" ? "login" : mode, value);
          }}
          options={[
            { value: "student", label: "Student" },
            { value: "admin", label: "Admin" },
          ]}
        />
        <SegmentedControl
          label="Account action"
          value={mode}
          onChange={(value) => {
            setFormError("");
            goTo(value, portal);
          }}
          options={[
            { value: "login", label: "Log in" },
            {
              value: "signup",
              label: "Sign up",
              disabled: portal === "admin",
              title:
                portal === "admin"
                  ? "Admin accounts are assigned. They are not created here."
                  : undefined,
            },
          ]}
        />
      </div>

      {portal === "admin" ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Admin accounts are assigned, not created from this page.
        </p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate={mode === "login"}>
        {formError ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {formError}
          </p>
        ) : null}

        {mode === "signup" ? (
          <>
            <div>
              <label htmlFor="full_name" className="text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter full name"
                value={form.full_name}
                onChange={handleChange}
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="university" className="text-sm font-medium text-slate-700">
                University
              </label>
              <input
                id="university"
                name="university"
                type="text"
                required
                placeholder="Your university"
                value={form.university}
                onChange={handleChange}
                className={fieldClass}
              />
            </div>
          </>
        ) : null}

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={portal === "admin" ? "staff@email.com" : "student@email.com"}
            value={form.email}
            onChange={handleChange}
            aria-invalid={mode === "login" && Boolean(formError) ? true : undefined}
            className={withFieldError(fieldClass, mode === "login" && Boolean(formError))}
          />
        </div>

        {mode === "signup" ? (
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-slate-700">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="03XXXXXXXXX"
              value={form.phone}
              onChange={handleChange}
              className={fieldClass}
            />
            <p className="mt-1 text-xs text-slate-500">Used later to coordinate a joined ride.</p>
          </div>
        ) : null}

        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative mt-1.5">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder={mode === "signup" ? "At least 8 characters" : "Enter password"}
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.password) || undefined}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              className={`${withFieldError(
                fieldControlClass,
                Boolean(fieldErrors.password) || (mode === "login" && Boolean(formError))
              )} pr-20`}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <FieldError id="password-error" message={fieldErrors.password} />
        </div>

        {mode === "signup" ? (
          <div>
            <label htmlFor="confirm_password" className="text-sm font-medium text-slate-700">
              Confirm password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={form.confirm_password}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.confirm_password) || undefined}
              aria-describedby={
                fieldErrors.confirm_password ? "confirm-password-error" : undefined
              }
              className={withFieldError(fieldClass, Boolean(fieldErrors.confirm_password))}
            />
            <FieldError id="confirm-password-error" message={fieldErrors.confirm_password} />
          </div>
        ) : null}

        <Button type="submit" className="w-full" loading={submitting} disabled={submitting}>
          {mode === "signup" ? "Sign up" : "Log in"}
        </Button>
      </form>
    </AuthSplit>
  );
}

export default AuthPage;
