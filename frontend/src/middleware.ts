import { fetchClientById } from "@/services/client";
import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = pathname.match(/^\/clientes\/([^\/\?]+)$/);
  if (match) {
    const id = match[1];
    console.log(id);

    try {
      await fetchClientById(id);
    } catch (err) {
      console.log(err)
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // Se o cliente não for encontrado, redireciona para a página 404
        return NextResponse.redirect(new URL("/404", request.url));
      }
    }

    return NextResponse.next();
  }
}
