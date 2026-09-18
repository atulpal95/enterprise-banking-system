package com.atul.banking.security;

import com.atul.banking.entity.Customer;
import com.atul.banking.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

import com.atul.banking.entity.Admin;
import com.atul.banking.repository.AdminRepository;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // Check customer
        Optional<Customer> customer = customerRepository.findByEmail(email);

        if (customer.isPresent()) {
            return new User(
                    customer.get().getEmail(),
                    customer.get().getPassword(),
                    Collections.singletonList(
                            new SimpleGrantedAuthority(customer.get().getRole())
                    )
            );
        }

        // Check admin
        Optional<Admin> admin = adminRepository.findByEmail(email);

        if (admin.isPresent()) {
            return new User(
                    admin.get().getEmail(),
                    admin.get().getPassword(),
                    Collections.singletonList(
                            new SimpleGrantedAuthority(admin.get().getRole())
                    )
            );
        }

        throw new UsernameNotFoundException("User not found");
    }
}