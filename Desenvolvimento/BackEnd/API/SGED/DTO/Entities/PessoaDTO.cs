﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using static System.Net.Mime.MediaTypeNames;

namespace SGED.DTO.Entities
{
    public class PessoaDTO
    {
        [Required(ErrorMessage = "O nome é requerido!")]
        [MinLength(10)]
        [MaxLength(70)]
        public string NomePessoa { get; set; }

        [Required(ErrorMessage = "O e-mail é requerido!")]
        [EmailAddress]
        public string EmailPessoa { get; set; }

        [Required(ErrorMessage = "O telefone é requerido!")]
        [MinLength(15)]
        [MaxLength(19)]
        public string TelefonePessoa { get; set; }

        [Required(ErrorMessage = "O CPF ou CNPJ é requerido!")]
        [MinLength(14)]
        [MaxLength(18)]
        public string CpfCnpjPessoa { get; set; }

        [Required(ErrorMessage = "O RG ou IE é requerido!")]
        [MinLength(12)]
        [MaxLength(15)]
        public string RgIEPessoa { get; set; }


        public static int CpfCnpj(string cpfCnpj)
        {

            if (cpfCnpj.Length == 14)
            {
                if (cpfCnpj[3] == '.' || cpfCnpj[7] == '.' || cpfCnpj[11] == '-')
                {
                    cpfCnpj = cpfCnpj.Trim();
                    cpfCnpj = cpfCnpj.Replace(".", "").Replace("-", "");
                    if (!Regex.IsMatch(cpfCnpj, @"^\d+$")) return -3;

                    if (verificarCpf(cpfCnpj)) return 1;
                    else return -1;
                }
            }
            else
            {
                if (cpfCnpj[2] == '.' || cpfCnpj[6] == '.' || cpfCnpj[10] == '/' || cpfCnpj[15] == '-')
                {
                    cpfCnpj = cpfCnpj.Trim();
                    cpfCnpj = cpfCnpj.Replace(".", "").Replace("/", "").Replace("-", "");
                    if (!Regex.IsMatch(cpfCnpj, @"^\d+$")) return -3;

                    if (verificarCnpj(cpfCnpj)) return 2;
                    else return -2;
                }
            }
            return 0;
        }

        public static bool verificarCpf(string cpf)
        {
            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;
            cpf = cpf.Trim();
            cpf = cpf.Replace(".", "").Replace("-", "");
            tempCpf = cpf.Substring(0, 9);
            soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf = tempCpf + digito;
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();
            return cpf.EndsWith(digito);
        }

        public static bool verificarCnpj(string cnpj)
        {
            int[] multiplicador1 = new int[12] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[13] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int soma;
            int resto;
            string digito;
            string tempCnpj;
            tempCnpj = cnpj.Substring(0, 12);
            soma = 0;
            for (int i = 0; i < 12; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador1[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCnpj = tempCnpj + digito;
            soma = 0;
            for (int i = 0; i < 13; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador2[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();
            return cnpj.EndsWith(digito);
        }

        public static int RgIe(string rgIe)
        {

            if (rgIe.Length == 12)
            {
                if (rgIe[2] == '.' || rgIe[6] == '.' || rgIe[10] == '-')
                {
                    rgIe = rgIe.Trim();
                    rgIe = rgIe.Replace(".", "").Replace("-", "");
                    if (!Regex.IsMatch(rgIe, @"^\d+$")) return -3;

                    if (verificarRg(rgIe)) return 1;
                    else return -1;
                }
            }
            else
            {
                if (rgIe[3] == '.' || rgIe[7] == '.' || rgIe[11] == '.')
                {
                    rgIe = rgIe.Trim();
                    rgIe = rgIe.Replace(".", "");
                    if (!Regex.IsMatch(rgIe, @"^\d+$")) return -3;

                    if (verificarIe(rgIe)) return 2;
                    else return -2;
                }
            }
            return 0;
        }

        public static bool verificarRg(string rg)
        {
            int[] multiplicador1 = new int[8] { 2, 3, 4, 5, 6, 7, 8, 9 };
            string digito;
            int soma;
            int resto;
            soma = 0;

            for (int i = 0; i < 8; i++)
                soma += int.Parse(rg[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            return rg.EndsWith(digito);
        }

        public static bool verificarIe(string ie)
        {
            int[] multiplicador1 = new int[7] { 1, 3, 4, 5, 6, 7, 8 };
            string digito;
            int soma;
            int resto;
            soma = 0;

            for (int i = 0; i < 7; i++)
                soma += int.Parse(ie[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            string ie2 = ie.Substring(0, 7) + digito.Substring(1) + ie.Substring(9, 11);
            return ie == ie2;
        }

        If Left(strOrigem, 1) = "P" Then
                strBase = Left(Trim(strOrigem) & "0000000000000", 13)
                strBase2 = Mid(strBase, 2, 8)
                intSoma = 0
                intPeso = 1
                 
                For intPos = 1 To 8
                    intValor = CInt(Mid(strBase, intPos, 1))
                    intValor = intValor* intPeso
                    intSoma = intSoma + intValor
                    intPeso = intPeso + 1


                    If intPeso = 2 Then
                        intPeso = 3
                    End If


                    If intPeso = 9 Then
                        intPeso = 10
                    End If
                Next

                intResto = intSoma Mod 11
                strDigito1 = Right(CStr(intResto), 1)
                strBase2 = Left(strBase, 8) & strDigito1 & Mid(strBase, 11, 3)
            Else
                strBase = Left(Trim(strOrigem) & "000000000000", 12)
                intSoma = 0
                intPeso = 1
                 
                For intPos = 1 To 8
                    intValor = CInt(Mid(strBase, intPos, 1))
                    intValor = intValor* intPeso
                    intSoma = intSoma + intValor
                    intPeso = intPeso + 1


                    If intPeso = 2 Then
                        intPeso = 3
                    End If


                    If intPeso = 9 Then
                        intPeso = 10
                    End If
                Next

                intResto = intSoma Mod 11
                strDigito1 = Right(CStr(intResto), 1)
                strBase2 = Left(strBase, 8) & strDigito1 & Mid(strBase, 10, 2)
                intSoma = 0
                intPeso = 2
                 
                For intPos = 11 To 1 Step -1
                    intValor = CInt(Mid(strBase, intPos, 1))
                    intValor = intValor* intPeso
                    intSoma = intSoma + intValor
                    intPeso = intPeso + 1


                    If intPeso > 10 Then
                        intPeso = 2
                    End If
                Next

                intResto = intSoma Mod 11
                strDigito2 = Right(CStr(intResto), 1)
                strBase2 = strBase2 & strDigito2
            End If

            If strBase2 = strOrigem Then
                ChecaInscrE = True
            End If
    }
}
