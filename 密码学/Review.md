# Review

#### 古典密码

单表密码

加法密码（凯撒密码）

乘法密码

+ 加密：$y = x\cdot k \mod n$
+ 解密：$x=y\cdot k^{-1} \mod n$

仿射密码

+ $y = (x\cdot k_1 + k_2) \mod n$
+ $x = (y-k_2)\cdot k_1 \mod n$

多表密码

+ 对每个明文字母采用不同的单表代换，即同一明文字母对应多个密文字母
+ 《连城诀》
+ Vigenere
    + $y = (x+k_i)\mod n$
    + $x = (y-k_i)\mod n$
+ Enigma
    + Message key，齿轮初始位置ring setting
    + $\Delta=messageKey - ringSetting$
    + $y = ring_i(x+\Delta)-\Delta$
    + plugboard
    + go back
    + double stepping，中间的轮子



#### Hash

md5

+ 彩虹表 rainbow table，用来破解md5

    比如说要建立一张包含4个大写英文字母的彩虹表

    1. 产生一个随机数$n_0\in[0,26^4-1]$
    2. 找出$n_0$对应的字母组合$p_0$，计算$m_0=md5(p_0)$
    3. $n_k=m_{k-1}\mod 26^4$
    4. 找到$n_k$对应的字母组合$p_k$，然后计算$m_k=md5(p_k)$
    5. 得到一条链

    比如$M$是由某4个大写字母组合生成的md5值，要破解$M$

    1. 在数据库中查找$M$，如果找到了，表示$M$是链的末端，根据这条链的$n_0$再算一次，算到最后得到$p$
    2. 如果没找到，说明$M$是在某条链的中间，这时候假设$M$是在倒数第二个，然后用$M$再算一次算到链尾，在数据库里查找链尾，如果查到了就说明假设是对的，没查到继续往前

+ 分块计算，每块64字节

    + 当最后一块刚好为64字节时，该块只能算倒数第2块，即它后面大小为0的一块才是最后一个
    + 如果最后一块不够64字节，需要填充
        + 如果少于56字节，则补上一个0x80，再补0x00到56个
        + 如果够56个字节，则把这个块补满后，再补一个块到56字节
        + 最后补上8个字节，用小端表示的实际明文长度

+ 代码

    ```c
    #include <openssl/md5.h>
    int main(){
        int i;
        unsigned char s[100]="Hello", t[100];
        MD5(s, strlen(s), t);
    	for(i=0; i<16; i++){
            printf("%02X ", t[i]);
        }
    }
    // 8B 1A 99 53 C4 61 12 96 A8 27 AB F8 C4 78 04 D7
    ```

    ```c
    #include <openssl/md5.h>
    int main(){
        int i;
        unsigned char s[100]="Hello", t[100];
        MD5_CTX m; //ctx:context
        MD5_Init(&m);
        MD5_Update(&m, s, 64);
        MD5_Update(&m, s+64, 64);
        MD5_Update(&m, s+64+64, 64);
        MD5_Update(&m, s+64+64+64, 1);
        MD5_Final(t, &m);
        for(i=0; i<16; i++){
            printf("%02X ", t[i]);
        }
    }
    ```

+ md5常与其他算法（比如RSA）结合起来做签名

    1. $m=md5(letter)$
    2. $m'=rsa(m,prv_A)$
    3. A把letter和$m'$发给B
    4. B验证$rsa(m',pub_A)=md5(letter)$



SHA

+ sha1算出来的hash有160位，也就是20字节，比md5多了32位
+ sha1也是分块计算，每块64字节，当最后一块不足64位时按md5那样进行填充
+ 数据块最后一定要补上表示报文总位数的8个字节





#### 分组密码与流密码

分组密码模式

+ ECB
    + 简单的并行处理，相同的明文块总被加密成相同的密文块
+ CBC
    + $C_j=E_k(P_j\oplus C_{j-1})$
    + $P_j=D_k(C_j)\oplus C_{j-1}$
+ CFB
    + $X_0$是提供的初始向量（IV）
    + $C_j=P_j\oplus(E_k(X_j))$
    + $X_{j+1}=C_j$



流密码算法RC4

+ 先初始化一个长度为256的S盒，再根据密钥打乱S盒

    ```pseudocode
    for i from 0 to 255
    	S[i] := i
    endfor
    j := 0
    for( i=0 ; i<256 ; i++)
        j := (j + S[i] + key[i mod keylength]) % 256
        swap values of S[i] and S[j]
    endfor
    ```

+ 对每个明文字节定位S盒中的一个元素做异或，并更新S盒

    ```pseudocode
    i := 0
    j := 0
    while GeneratingOutput:
        i := (i + 1) mod 256   //a
        j := (j + S[i]) mod 256 //b
        swap values of S[i] and S[j]  //c
        k := inputByte ^ S[(S[i] + S[j]) % 256]
        output K
    endwhile
    ```

+ 此算法保证每256次循环中S盒的每个元素至少被交换过一次





#### DES和AES

DES (Data Encryption Standard)

+ 明文和密文都是64位，8字节

+ 加密和解密密钥相同

+ 密钥有效位只有56位，剩下8位用来做奇偶校验

+ 根据密钥生成子密钥

+ 加密解密只有子密钥顺序相反

+ 基本流程，16个round

    1. 先经过IP，然后分成左右两半$L_0$，$R_0$
    2. $R_{k+1}=R_k$
    3. $L_{k+1}=L_k\oplus f_{k+1}(R_{k})$
    4. 交换$L_{k+1}$和$R_{k+1}$开始下一个Round，如果是最后一个round结束则不交换
    5. 经过FP即IP的逆

+ f函数

    1. 32位输入先拓展为48位
    2. 48位再和48位的subkey做异或
    3. 再经过8个4-to-3的S盒，得到32位输出

+ 子密钥生成

    1. 56位密钥分成左右两个部分各28位
    2. 分别循环左移后拼在一次经过PC2得到一个48位的子密钥
    3. 再继续循环左移得到下一个子密钥
    4. 每次循环左移1位或者2位，由round数决定

+ 代码

    ```c
    #include <stdio.h>
    #include <string.h>
    #include <openssl/des.h>
    
    int main(){
        unsigned char bufin[100], bufout[100], *pin, *pout;
        char hex[100];
        int i, n, blocks;
        unsigned char k[]="ABCD1234";
        des_key_schedule ks;
        des_set_key((DES_cblock *)k, ks);
        gets(bufin);
        n = strlen(bufin);
        blocks = (n+7) / 8;
        pin = bufin;
        pout = bufout;
        for(i=0; i<n/8; i++){
            // 加密
            des_ecb_encrypt((DES_cblock*)pin, (DES_cblock*)pout, ks, DES_ENCRYPT);  
            pin += 8;
           	pout += 8;
        }
        if(n%8 != 0){
            memset(pin+n%8, 0, 8-n%8);
        	des_ecb_encrypt((DES_cblock*)pin, (DES_cblock*)pout, ks, DES_ENCRYPT);
            // 加密
        }
        pin += n%8;
        pout += 8;
        pout[0] = '\0';
        // 转化成16进制字符串
        for(i=0; i<blocks*8; i++){
            sprintf(hex+i*2, "%02X", bufout[i]);
        }
        puts(hex);
    }
    ```

    ```c
    #include <stdio.h>
    #include <string.h>
    #include <openssl/des.h>
    
    int main(){
        unsigned char bufin[100], bufout[100], *pin, *pout;
        char hex[100];
        int i, n, blocks;
        unsigned char k[]="ABCD1234";
        des_key_schedule ks;
        des_set_key((DES_cblock *)k, ks);
        gets(hex);
        n = strlen(hex)/2;
        for(i=0; i<n; i++){
            sscanf(&hex[i*2], "%02X", &bufin[i]);
        }
        blocks = n/8;
        pin = bufin;
        pout = bufout;
        for(i=0; i<blocks; i++){
            // 解密
            des_ecb_encrypt((DES_cblock*)pin, (DES_cblock*)pout, ks, DES_DECRYPT);
            pin += 8;
            pout += 8;
        }
    	pout[0] = '\0';
    	puts(bufout);
    }
    ```

+ 加密解密正确性：

    + $L_{16}=L_{15}\oplus f_{k_{16}}(R_{15})$
    + $R_{16}=R_{15}$
    + 密文$C=FP(L_{16}||R_{16})$
    + $L_{16}||R_{16}=IP(C)$
    + $L_{15}=L_{16}\oplus f_{k_{16}}(R_{16})=L_{16}\oplus f_{k_{16}}(R_{15})$
    + $R_{15}=R_{16}$

+ DES分组加密模式

    + ecb

    + cbc

        ```c
        c[0] = des_encrypt(block[0] ^ iv);
        c[1] = des_encrypt(block[1] ^ c[0]);
        ```

    + cfb

        ```c
        v = des_encrypt(iv); 	// v包含8字节
        c[0] = b[0] ^ v[0];		// c[0]是1字节密文
        iv = iv << 8 | c[0]; 	// iv左移1字节,末尾补c[0]
        v = des_encrypt(iv);
        c[1] = b[1] ^ v[0]; 	// c[1]是1字节密文
        ```



AES

+ $GF(2^8)$上的模0x11B乘法，农夫算法
+ 模$x^4+1$的，在$GF(2^8)$上的三次多项式乘法

+ 加密基本流程

    1. AddRoundKey

        矩阵中的每一个字节都与该次回合密钥（round key）做XOR运算；每个子密钥由密钥生成方案产生

    2. SubBytes

        透过一个非线性的替换函数，用查找表的方式把每个字节替换成对应的字节

    3. ShiftRows

        将矩阵中的每个横列进行循环式移位

        第一行不变，第二行向左循环移1字节，第三行向左循环移2字节，第四行3字节

    4. MixColumns

        为了充分混合矩阵中各个直行的操作。这个步骤使用线性转换来混合每内联的四个字节。最后一个加密循环中省略MixColumns步骤，而以另一个AddRoundKey取代

        每一列四个元素作为一个多项式与$3x^3+x^2+x+2$在模$x^4+1$下相乘

+ 解密基本流程

    1. InvMixColumn

        第一次为AddRoundKey，因为加密最后一次MixColumns是AddRoundKey

    2. InvShiftRows

    3. InvSubBytes

    4. AddRoundKey

+ 密钥生成

    + 由$N_k$个字生成$N_b(N_r+1)$个字
    + 递归生成
    + 初始密钥与实际密钥的关系




RSA

+ 拓展Euclid算法求模逆元

    + 原理：$ax+by=1\iff ax\equiv 1\mod b$

    + $$
        \begin{aligned}
        \gcd(a, b) &= ax_1+by_1\\
        \gcd(b, a\bmod b) &= bx_2+(a\bmod b)y_2\\
        \gcd(a,b) &= \gcd(a\bmod b,b)\\
        \Rightarrow ax_1+by_1 &= bx_2+(a\bmod b)y_2\\
        a \bmod b &= a-\lfloor a/b\rfloor \cdot b\\
        \Rightarrow ax_1+by_1 &= bx_2+(a-\lfloor a/b\rfloor\cdot b)y_2\\
        \Rightarrow ax_1+by_1 &= ay_2+b(x_2-\lfloor a/b \rfloor y_2)\\
        \Rightarrow x_1=y_2, y_1 &= x_2-\lfloor a/b \rfloor y_2
        \end{aligned}
        $$

    + 求a关于b的模逆元，就是找一个$x$

    + 比如求13关于35的模逆元
        $$
        \begin{aligned}
        35 &= 13 \times 2 + 9\\
        13 &= 9 \times 1 + 4\\
        9 &= 4 \times 2 + 1\\
        \end{aligned}
        $$
        于是有
        $$
        \begin{align}
        9&=35-13\times2\\
        4&=13-9\times1\\
        1&=9-4\times2
        \end{align}
        $$
        代回去
        $$
        \begin{aligned}
        \Rightarrow 1 &= 9-4 \times 2\\
        &=35-13\times2 -(13-9\times1)\times2\\
        &=35-13\times4+(35-13\times2)\times2\\
        &=35\times3-13\times8
        \end{aligned}
        $$
        于是$-8\bmod 35=27$就是13关于35的模逆元

+ 快速模除

    + $c\cdot a^b\mod n$
    + 如果$2\mid b$，$b=b/2$，$a = a^2\bmod n$
    + 如果$2\nmid b$，$b = b-1$，$c = c\cdot a \bmod n$

+ Basic procedure

    + two large prime $p$ and $q$
    + Calculate $n=pq$ and $\phi(n)=(p-1)(q-1)$
    + Pick some $e$ such that $\gcd(e, \phi(n))=1$, and $e$ is the public key
    + Calculate $d$ such that $de=1\mod \phi(n)$ and $d$ is the private key
    + Transform the message into an integer $m$
    + Cipher text $n=m^e\bmod n$
    + Decryption: $m = n^d\bmod n$

+ Rightness

    + From Euler‘s theorem we know $x^{\phi(n)}\equiv 1\mod n$ if $\gcd(x,n)=1$
        + Assume that $\phi(n)=k$ and $r_1,r_2,\cdots, r_k$ are what's $\phi(n)$ counts
        + Then $xr_1,xr_2,\cdots,xr_k$ are also coprime with $n$ and get different results modulus $n$
            + if $xr_i\equiv xr_j\mod n$, then $r_i\equiv r_j \mod n \Rightarrow r_i=r_j$
        + $\{xr_1\bmod n,xr_2\bmod n,\cdots,xr_k\bmod n\}=\{r_1,r_2,\cdots,r_k\}$
        + $x^kr_1r_2\cdots r_k\equiv r_1r_2\cdots r_k \mod n$
        + Since $r_1,r_2,\cdots,r_k$ are all coprime with $n$, there is $x^k\equiv 1\mod n$
        + Hence $x^{\phi(n)}\equiv 1 \mod n$
        
    + Since $de\equiv 1\mod \phi(n)$, there is some $t$ such that $de=t\phi(n)+1$

    + $$
        \begin{aligned}(m^e)^d &\equiv m^{t\phi(n)+1}\mod n\\& \equiv (m^{\phi(n)})^tm\mod n\\& \equiv 1^tm\mod n \\&\equiv m\mod n \end{aligned}
        $$

+ How to generate large primes?

    + Prime number theorem

        + Let $x$ be the number of prime numbers no larger then $x$, then
            $$
            \lim_{x\rightarrow\infin}\frac{\pi(x)\ln x}{x} = 1
            $$





ECC (Elliptic Curve Cryptography)

+ A elliptic curve: $y2=x^3+ax+b$
    + all points on the curve constitute a group if $4a^3+27b^2\neq 0$
    
    + Let $P=(x_1,y_1),Q=(x_2,y_2)$ then
    
        $P+Q=(x_3,y_3)$ where 
        $$
        x_3=\lambda^2-x_1-x_2\\y_3=\lambda(x_1-x_3)-y_1
        $$
        and
        $$
        \lambda=\left\{
        \begin{aligned}
        &\frac{y_2-y_1}{x_2-x_1},\quad  P\neq Q \\
        &\frac{3x_1^2+a}{2y_1},\quad P= Q
        \end{aligned}
        \right.
        $$
    
+ Euler formula

    + $y^2=x\bmod p$

        $x$是模$p$的平方剩余当且仅当 $x^{(p-1)/2}\equiv1\pmod p$

        $x$是模$p$的平方非剩余当且仅当 $x^{(p-1)/2}\equiv -1\pmod p$

+ points addtion example

    + $y^2 = x^3 + x + 6\pmod{11}$, that is $a=1,b=6,p=11$

    + $\alpha=(2,7)$

        $\lambda=\frac{3x_1^2+a}{2y_1}=\frac{3\times2^2+1}{2\times7}=13/14$

        $\lambda=13/14=13\times14^{-1}=2\times 3^{-1}=2\times4=8\mod 11$

        $x_3=\lambda^2-x_1-x_2=60\equiv 5 \mod 11$

        $y_3=\lambda(x_1-x_3)-y_1=8\times(-3)-7=-31 \equiv 2 \mod 11$

        Then $2\alpha=(5,2)$

        Since $13\alpha=0$ the order of $\alpha$ is 13

+ Encryption and decryption

    + Base point $G$
    + Public key and private key
        + Public key is a point $R=d\cdot G$
        + private key is $d$ and $d<n$ where $n$ is the order of $G$
    + Encryption
        + Choose a nonce $k<n$
        + Calculate $k\cdot G$ and the x-coordinate $r$ is the first part of the ciphertext
        + $s=m\cdot((k\cdot R).x)\bmod n$ is the second part of the ciphertext
    + Decryption
        + Calculate $r=k\cdot G$ from $r.x$ (since $r.x$ is the x-coordinate, it's easy)
        + $m=\frac{s}{(d\cdot r).x}=\frac{m\cdot(k\cdot R).x}{(d\cdot(k\cdot G)).x}=\frac{m\cdot(k\cdot (d\cdot G)).x}{(d\cdot(k\cdot G)).x}$
    + Example
        + $y^2=x^3+x+6\mod 11$
        + $G=(2,7)$ and the order of $G$, $n=13$
        + $d=7$ and then $R=d\cdot G=(7,2)$
        + Choose a nonce $k=6$ and plaintext $m=9$
        + $r=(k\cdot G)=6\cdot(2,7)=(7,9)$
        + $s=m\cdot((k\cdot R).x) = 9\times(8,3).x=72\equiv 7\mod 13$
        + $m=\frac{s}{(d\cdot r).x}=\frac{7}{(7\cdot (7,9)).x} = \frac{7}{(8,3).x} = 7\times8^{-1}\equiv7\times 5\equiv9\mod 13$
    + Sign and verify
        + ecdsa
            + $r=k\cdot G$，这里的$r$指的是点
            + $s=(m+r\times d)/k$，这里的$r$指的是点的x坐标
        + ecnr
            + $r=k\cdot G+m$
            + $s = k-r\times d$



Proof of $\gcd(a,b)=ax+by$

Consider $S=\{ax+by>0:a,b\in \Z \}$ and $d=\min S$, then show that

+ $d$ is a common divisor of $a$ and $b$
+ Any common divisor of $a$ and $b$ must divide $d$

First, if $d$ is not a common divisor of $a$ and $b$, suppose that $d$ cannot divides $a$



Second, if $c$ is a common divisor of $a$ and $b$, assume $a=uc$ and $b=vc$

then $d=ax+by=c(ux+vy)$



