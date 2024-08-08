// interface InviteUserParms {
//   email: string;
//   team_id: string | undefined;
// }

// export async function inviteUser({
//   email,
//   team_id,
// }: InviteUserParms): Promise<Invitation> {
//   try {
//     const response = await fetchData<Invitation>(`${url}/invite-user/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + String(accessToken),
//       },
//       data: { email, team_id },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }
