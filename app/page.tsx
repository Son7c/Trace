"use client";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import NavLanding from "@/components/navLanding";
import HeroSection from "@/components/HeroSection";

export default function Home() {
  // const { data: session, error, isPending } = authClient.useSession();

  // if (isPending) return <div>Loading session...</div>;

  // if (session) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="position:relative bg-[#020507] min-h-screen w-full">
      <NavLanding />
      <HeroSection />
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum accusamus
      officia nam repellendus optio, neque est recusandae quasi perspiciatis
      earum ea, quod aliquid ullam voluptatum pariatur qui deserunt perferendis
      exercitationem debitis facilis voluptatem soluta iusto iure. Recusandae
      fuga provident officiis corporis tempore voluptatem asperiores, vel natus.
      Est a ab laborum deleniti labore numquam repudiandae accusantium esse
      nostrum dolorem. Explicabo, error, animi omnis alias aut magni saepe
      reiciendis harum maxime soluta ut inventore unde impedit, maiores
      eligendi? Libero, recusandae! Qui laudantium blanditiis ullam dicta,
      mollitia dolor odio ipsa eveniet consequuntur voluptatum dignissimos
      labore iste veniam omnis culpa consectetur architecto impedit dolorem,
      tempore harum neque rem ut necessitatibus. Tempora, facilis earum magnam
      natus beatae officiis esse autem nam asperiores aperiam dolor, ab eius
      unde expedita maiores saepe cum consequuntur repudiandae adipisci illo
      eveniet a accusamus. Culpa aliquid accusantium fuga, dolores repellat
      explicabo, ab illo, accusamus alias expedita qui? Blanditiis, dolor rerum?
      Laborum cupiditate, neque facere beatae dignissimos totam quos veritatis!
      Minus, suscipit rerum. Rerum est nemo deleniti modi excepturi ipsum aut
      suscipit necessitatibus reiciendis mollitia hic error alias natus ex,
      assumenda laudantium itaque nulla praesentium iste. Fuga et quasi
      assumenda adipisci incidunt ex qui officia vitae! Tempora minus a delectus
      rem, enim optio qui magni est consectetur aut numquam commodi dicta
      labore, sequi laborum sint repellat hic voluptate, pariatur aspernatur.
      Obcaecati minima quaerat suscipit, dolorum facere eius accusantium eum
      ipsa harum atque explicabo odit sapiente soluta velit quam eligendi
      nesciunt commodi. Mollitia placeat facilis molestias sunt consequuntur
      reprehenderit sit dolorem eveniet ratione ea amet similique ipsa totam
      minima cum eius necessitatibus quos, porro dolor consectetur delectus!
      Laborum reiciendis, velit quisquam porro iusto aliquam accusantium quasi
      molestiae tenetur, tempore incidunt facilis beatae fugiat repellendus
      excepturi expedita id consequatur repellat consequuntur omnis quo.
      Laudantium blanditiis nam enim veniam iure ipsum maxime vel, hic eum
      laboriosam cumque velit, culpa rerum mollitia voluptatem illo dolor. Ipsum
      unde odio, officiis ab quisquam, beatae reiciendis laudantium eos tempore
      nihil, dignissimos error reprehenderit. Perferendis tempora officia quasi
      at dolorem quam. Consectetur nihil voluptatem commodi sit modi eos
      mollitia recusandae quas est. Accusamus, iusto. Porro ratione modi
      nesciunt ad eaque sit nam accusamus iure ex nobis? Incidunt commodi
      pariatur fugiat esse consequuntur alias et assumenda obcaecati earum
      impedit tenetur sequi, officia quod vel rerum nesciunt suscipit dicta
      officiis veniam rem adipisci minus enim ipsum repudiandae. Aspernatur
      quisquam, suscipit rem quae, natus eum eos amet modi facilis consequuntur
      reprehenderit repellat minus vitae voluptatum commodi placeat nobis
      distinctio voluptates incidunt deleniti tenetur? At, itaque? Repudiandae
      saepe corporis laboriosam tenetur animi dolor, exercitationem eos harum
      vitae nam est ut ea molestias, quam accusantium similique mollitia
      provident sequi vero. Explicabo deleniti, odio reiciendis unde nesciunt
      aut, voluptatum maxime natus beatae molestias, numquam voluptates maiores.
      Quisquam nisi architecto debitis minima quaerat, deserunt fugiat porro
      mollitia doloribus aspernatur ratione quae modi libero unde reprehenderit
      quasi, totam quibusdam omnis eligendi delectus corrupti! Repellendus,
      atque iure facilis aspernatur porro ab! Voluptate sint velit possimus
      eligendi, accusamus nobis quis aspernatur maxime vel magnam dolore, illo
      assumenda voluptatem quam sequi.
    </div>
  );
}
