'use server';

import { signIn, signOut } from '@/auth';
import { db } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

/**
 * Register a new user (Student or Teacher)
 */
export async function register(prevState, formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role') || 'STUDENT'; // STUDENT or TEACHER

    if (!name || !email || !password) {
      return { error: 'Please fill in all fields.' };
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'A user with this email already exists.' };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        // Populate default values according to roles
        description: role === 'TEACHER' 
          ? 'Senior subject instructor on Eduweaver.' 
          : 'Highly motivated student aiming for success.',
        grade: role === 'STUDENT' ? 'First Grade' : null,
        lectureDate: role === 'TEACHER' ? 'Every Wednesday' : null,
        price: role === 'TEACHER' ? '170 L.E / Month' : null,
        subject: role === 'TEACHER' ? 'English' : null,
      },
    });

    return { success: true, message: 'Registration successful! You can now log in.' };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Something went wrong during registration.' };
  }
}

/**
 * Log in an existing user
 */
export async function login(prevState, formData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return { error: 'Please enter both email and password.' };
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false, // Handle redirect in client manually or use default
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' };
        default:
          return { error: 'Authentication failed.' };
      }
    }
    // Auth.js redirects under the hood by throwing a specific error, which we should rethrow
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    console.error('Login error:', error);
    return { error: 'Invalid email or password.' };
  }
}

/**
 * Log out the user
 */
export async function logout() {
  await signOut({ redirectTo: '/' });
}

/**
 * Update user profile details
 */
export async function updateProfile(userId, profileData) {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: profileData,
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Update profile error:', error);
    return { error: 'Failed to update profile.' };
  }
}

/**
 * Get the current user profile from database
 */
export async function getUserProfile(email) {
  try {
    if (!email) return null;
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        description: true,
        grade: true,
        interests: true,
        gender: true,
        lectureDate: true,
        price: true,
        subject: true,
      }
    });
    return user;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}
