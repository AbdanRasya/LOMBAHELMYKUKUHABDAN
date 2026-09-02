"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema, forgotPasswordSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";

export async function registerAction(data: {
  name: string;
  email: string;
  password: string;
  role: "COMPANY" | "UMKM";
}) {
  try {
    const existingUser = await db.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return { success: false, error: "Email sudah terdaftar" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    });

    // Create role-specific profile
    if (data.role === "COMPANY") {
      await db.companyProfile.create({
        data: {
          userId: user.id,
          companyName: data.name,
        },
      });
    } else if (data.role === "UMKM") {
      await db.umkmProfile.create({
        data: {
          userId: user.id,
          businessName: data.name,
        },
      });
    }

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    await db.verificationToken.create({
      data: {
        identifier: data.email,
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email (non-blocking / error-safe)
    try {
      await sendVerificationEmail(data.email, data.name, token);
    } catch (emailErr) {
      console.error("Non-critical: Verification email failed to send:", emailErr);
    }

    // Create system log (non-blocking / error-safe)
    try {
      await db.systemLog.create({
        data: {
          userId: user.id,
          action: "USER_REGISTER",
          entity: "User",
          entityId: user.id,
          metadata: { role: data.role },
        },
      });
    } catch (logErr) {
      console.error("Non-critical: SystemLog failed:", logErr);
    }

    return { success: true, message: "Akun berhasil dibuat! Silakan masuk ke akun Anda." };
  } catch (error: any) {
    console.error("Register error:", error);
    return { success: false, error: error?.message || "Terjadi kesalahan saat pendaftaran. Silakan coba lagi." };
  }
}

export async function loginAction(email: string, password: string, callbackUrl?: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Email atau password salah" };
    }

    const isValid = await bcrypt.compare(password, user.password || "");
    if (!isValid) {
      return { success: false, error: "Email atau password salah" };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const targetUrl = callbackUrl || (
      user.role === "ADMIN" ? "/admin/dashboard" :
      user.role === "UMKM" ? "/umkm/dashboard" :
      "/company/dashboard"
    );

    return { 
      success: true, 
      user: { name: user.name, email: user.email, role: user.role },
      redirectUrl: targetUrl
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Email atau password salah" };
        default:
          return { success: false, error: "Terjadi kesalahan saat login" };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function verifyEmailAction(token: string) {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { token, expires: { gt: new Date() } },
    });

    if (!verificationToken) {
      return { success: false, error: "Token tidak valid atau sudah kedaluwarsa" };
    }

    await db.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.delete({
      where: { identifier_token: { identifier: verificationToken.identifier, token } },
    });

    return { success: true, message: "Email berhasil diverifikasi!" };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan saat verifikasi" };
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      // Return success to prevent email enumeration
      return { success: true, message: "Jika email terdaftar, link reset akan dikirim." };
    }

    const token = crypto.randomBytes(32).toString("hex");
    await db.passwordResetToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(email, user.name || email, token);

    return { success: true, message: "Jika email terdaftar, link reset akan dikirim." };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan. Silakan coba lagi." };
  }
}

export async function resetPasswordAction(token: string, newPassword: string) {
  try {
    const resetToken = await db.passwordResetToken.findFirst({
      where: { token, expires: { gt: new Date() } },
    });

    if (!resetToken) {
      return { success: false, error: "Token tidak valid atau sudah kedaluwarsa" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.user.update({
      where: { email: resetToken.identifier },
      data: { password: hashedPassword },
    });

    await db.passwordResetToken.delete({ where: { token } });

    return { success: true, message: "Password berhasil diubah!" };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan saat reset password" };
  }
}
